import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"

export interface Cadence extends Amount {
	interval: Cadence.Interval
	created: isoly.Date
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
		created: isly.fromIs("Date", isoly.Date.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function allocated(cadence: Cadence, date: isoly.Date, options?: { limit?: number }): number {
		let result = 0
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
	 * formula described here https://github.com/issuefab/app/issues/232
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
		const [, singles] = partition(children, child => child.interval != "single")
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
				if (balance <= 0)
					break
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
	export function getDate(cadence: Cadence) {
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
}
