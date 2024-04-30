import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import { findPath } from "../Delegation/find"
import { exchange } from "../Payment/exchange"

export interface Cadence extends Amount {
	interval: Cadence.Interval
	created: isoly.Date
	sustainable?: isoly.Date
}
export namespace Cadence {
	export const intervals = ["single", "day", "week", "month", "year"] as const
	export type Interval = typeof intervals[number]
	export const type = Amount.type.extend<Cadence>({
		interval: isly.union<Interval, "single", "day", "week", "month", "year">(
			isly.string("single"),
			isly.string("day"),
			isly.string("week"),
			isly.string("month"),
			isly.string("year")
		),
		created: isly.fromIs("isoly.Date", isoly.Date.is),
		sustainable: isly.fromIs("isoly.Date", isoly.Date.is).optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function allocated(cadence: Cadence, date: isoly.Date, options?: { limit?: number }): number {
		let result = 0
		date = cadence.sustainable && cadence.sustainable < date ? cadence.sustainable : date
		if (cadence.created <= date) {
			if (cadence.interval == "year") {
				const initial = isoly.Date.firstOfYear(cadence.created)
				result = Math.max(
					0,
					isoly.Currency.add(
						cadence.currency,
						isoly.Currency.multiply(
							cadence.currency,
							isoly.Date.getYear(date) - isoly.Date.getYear(initial),
							cadence.value
						),
						cadence.value
					)
				)
			} else if (cadence.interval == "month") {
				const initial = isoly.Date.firstOfMonth(cadence.created)
				result = Math.max(
					0,
					isoly.Currency.add(
						cadence.currency,
						isoly.Currency.multiply(
							cadence.currency,
							(isoly.Date.getYear(date) - isoly.Date.getYear(initial)) * 12 +
								(isoly.Date.getMonth(date) - isoly.Date.getMonth(initial)),
							cadence.value
						),
						cadence.value
					)
				)
			} else if (cadence.interval == "week") {
				const initial = isoly.Date.firstOfWeek(cadence.created)
				result = Math.max(
					0,
					isoly.Currency.add(
						cadence.currency,
						isoly.Currency.multiply(cadence.currency, Math.trunc(duration(date, initial) / 7), cadence.value),
						cadence.value
					)
				)
			} else if (cadence.interval == "day")
				result = Math.max(
					0,
					isoly.Currency.add(
						cadence.currency,
						isoly.Currency.multiply(cadence.currency, duration(date, cadence.created), cadence.value),
						cadence.value
					)
				)
			else
				result = cadence.value
		}
		return options?.limit == undefined
			? result
			: isoly.Currency.multiply(
					cadence.currency,
					Math.trunc(isoly.Currency.divide(cadence.currency, Math.min(options.limit, result), cadence.value)),
					cadence.value
			  )
	}
	function partition<T>(array: T[], filter: (item: T) => boolean): [T[], T[]] {
		const pass: T[] = []
		const fail: T[] = []
		array.forEach(item => (filter(item) ? pass.push(item) : fail.push(item)))
		return [pass, fail]
	}
	/**
	 * Cadence max cap calculated from the parents delegation max support day
	 * d = (y + sum(c * t)) / (sum(c))
	 * where:
	 *
	 * c = cost per day of a delegation (sum is sum of all)
	 *
	 * t = the delta of parents delegations created date and the childs created date
	 *
	 * d = the days where the child delegation reach its cap (parents money is 0)
	 *
	 * y = upper limit, the parents: cap - single childrens amounts
	 *
	 * parameters explained by sustainable(...)
	 */
	function approximate(parent: Cadence, children: Cadence[], date: isoly.Date, options?: { limit?: number }): number {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		const funds =
			Math.max(allocated(parent, date), options?.limit ?? 0) -
			singles.reduce((result, cadence) => result + cadence.value, 0)
		const rates = cadences.map(cadence => {
			const days = Math.abs(duration(date, cadence.created)) + 1
			const allocated = Cadence.allocated(cadence, date)
			return isoly.Currency.divide(cadence.currency, allocated, days)
		})
		const numerator =
			funds +
			cadences.reduce((result, cadence, index) => {
				const time = Math.abs(duration(cadence.created, parent.created))
				const rate = rates[index]
				return result + rate * time
			}, 0)
		const denominator = rates.reduce((result, cost) => result + cost, 0)
		const result = Math.trunc(numerator / denominator)
		return !Number.isNaN(result) ? result : Infinity
	}
	/**
	 * calculates the number of days from the parents creation the parent can sustain its children.
	 *
	 * the provided date is the latest date that should be considered when
	 * calculating how long the parent can sustain its children.
	 *
	 * the result of the function is days relative to the parents created date.
	 * `isoly.Date.next(parent.created, sustainable(...))` can be used
	 * to calculate the absolute date.
	 *
	 * providing a limit reduces the caps the parents
	 * resources to the limit if it is calculated to be more
	 *
	 * Potential optimizations:
	 * 1: dynamically change the next function
	 * and use it for iteration
	 * 2: improve the approximation by changing "y"
	 * in the formula to be any line instead of constant
	 * 3: steps in bigger increments and go backwards if overshooting
	 * 4: frontend can put the work in a background worker
	 */
	export function sustainable(
		parent: Cadence,
		children: Cadence[],
		date: isoly.Date,
		options?: { limit?: number }
	): number {
		const singles = children.filter(child => child.interval == "single")
		const limit =
			Math.min(allocated(parent, date), options?.limit ?? Infinity) -
			singles.reduce((result, cadence) => result + cadence.value, 0)

		const max = duration(date, parent.created)
		const approximation = Math.max(0, Math.min(max, approximate(parent, children, date, { limit })))
		const approximationDate = isoly.Date.next(parent.created, approximation)
		const balance =
			allocated(parent, approximationDate) -
			children.reduce((result, cadence) => result + allocated(cadence, approximationDate), 0)

		let days: number
		if (balance >= 0)
			for (days = approximation; days < max; days++) {
				const next = isoly.Date.next(parent.created, days)
				const balance =
					allocated(parent, next) - children.reduce((result, cadence) => result + allocated(cadence, next), 0)
				if (balance < 0) {
					days--
					break
				}
			}
		else
			for (days = approximation; days > -1; days--) {
				const next = isoly.Date.next(parent.created, days)
				const balance =
					allocated(parent, next) - children.reduce((result, cadence) => result + allocated(cadence, next), 0)
				if (balance >= 0)
					break
			}
		return days
	}
	function duration(first: isoly.Date | isoly.DateTime, other: isoly.Date | isoly.DateTime): number {
		return Math.trunc((new Date(first).getTime() - new Date(other).getTime()) / 1_000 / 3_600 / 24)
	}
	export function getDate(cadence: Cadence): isoly.Date {
		let result: isoly.Date
		switch (cadence.interval) {
			case "year":
				result = isoly.Date.lastOfYear(isoly.Date.now())
				break
			case "month":
				result = isoly.Date.lastOfMonth(isoly.Date.now())
				break
			case "week":
				result = isoly.Date.lastOfWeek(isoly.Date.now())
				break
			default:
				result = isoly.Date.now()
				break
		}
		return result
	}
	/**
	 * checks if the parent node under root can sustain given cadence if it is added.
	 *
	 * Optional date overrides the date on which the given cadence is added in case the cadence should be added as if it was added in the past.
	 */
	export function check(
		root: CostCenter,
		parent: CostCenter.Identifier | Delegation.Identifier,
		cadence: Cadence,
		options?: { date?: isoly.Date }
	): boolean {
		let result: Return<typeof check>
		const path = findPath([root], parent)?.map(node => ({
			node: node,
			children: node.usage.map(child =>
				child.type == "purchase" ? exchange(child.payment, node.amount.currency) ?? child.payment.limit : child.amount
			),
		}))
		const target = path?.at(-1)
		if (!path || !path.length || !target)
			result = false
		else {
			const sustainable = path
				.slice(0, -1)
				.reduce<isoly.Date>(
					(result: isoly.Date, { node, children }) =>
						isoly.Date.next(
							node.amount.created,
							Cadence.sustainable(node.amount, children, result, { limit: Cadence.allocated(node.amount, result) })
						),
					options?.date && options.date > cadence.created ? options.date : cadence.created
				)
			const available = Cadence.allocated(target.node.amount, sustainable)
			const allocated = target.children.reduce(
				(result, cadence) =>
					isoly.Currency.add(target.node.amount.currency, result, Cadence.allocated(cadence, sustainable)),
				0
			)
			const addition = Cadence.allocated(cadence, sustainable)
			result = isoly.Currency.subtract(target.node.amount.currency, available, allocated) >= addition
		}
		return result
	}
}
