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
		interval: isly.union(isly.string("year"), isly.string("month"), isly.string("week"), isly.string("single")),
		created: isly.fromIs("Date", isoly.Date.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	function dayDiff(first: isoly.Date | isoly.DateTime, other: isoly.Date | isoly.DateTime): number {
		return Math.trunc((new Date(first).getTime() - new Date(other).getTime()) / 1_000 / 3_600 / 24)
	}
	export function allocated(cadence: Cadence, date: isoly.Date, options?: { cap?: number }): number {
		let result = 0
		if (cadence.created <= date) {
			if (cadence.interval == "year") {
				const initial = isoly.Date.firstOfYear(cadence.created)
				result = Math.max(0, (isoly.Date.getYear(date) - isoly.Date.getYear(initial)) * cadence.value + cadence.value)
			} else if (cadence.interval == "month") {
				const initial = isoly.Date.firstOfMonth(cadence.created)
				result = Math.max(
					0,
					((isoly.Date.getYear(date) - isoly.Date.getYear(initial)) * 12 +
						(isoly.Date.getMonth(date) - isoly.Date.getMonth(initial))) *
						cadence.value +
						cadence.value
				)
			} else if (cadence.interval == "week") {
				const initial = isoly.Date.firstOfWeek(cadence.created)
				result = Math.max(0, Math.trunc(dayDiff(date, initial) / 7) * cadence.value + cadence.value)
			} else if (cadence.interval == "day")
				result = Math.max(0, dayDiff(date, cadence.created) * cadence.value + cadence.value)
			else
				result = cadence.value
		}
		return options?.cap == undefined ? result : Math.min(options.cap, result)
	}
	function partition<T>(array: T[], filter: (item: T) => boolean): [T[], T[]] {
		const pass: T[] = []
		const fail: T[] = []
		array.forEach(item => (filter(item) ? pass.push(item) : fail.push(item)))
		return [pass, fail]
	}
	function approximate(self: Cadence, children: Cadence[], date: isoly.Date, options?: { cap?: number }) {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		const y =
			Math.max(allocated(self, date), options?.cap ?? 0) -
			singles.reduce((result, cadence) => result + cadence.value, 0)
		const costPerDayPerCadence = cadences.map(cadence => {
			const days = Math.abs((new Date(date).getTime() - new Date(cadence.created).getTime()) / 1000 / 3600 / 24) + 1
			const allocated = Cadence.allocated(cadence, date)
			return isoly.Currency.divide(cadence.currency, allocated, days)
		})
		const numerator =
			y +
			cadences.reduce((result, cadence, index) => {
				const t = Math.abs(
					(new Date(self.created).getTime() - new Date(cadence.created).getTime()) / 1_000 / 3_600 / 24
				)
				const c = costPerDayPerCadence[index]
				return result + c * t
			}, 0)
		const denominator = costPerDayPerCadence.reduce((result, cost) => result + cost, 0)
		const result = numerator / denominator
		return Math.trunc(result)
	}
	export function sustainable(
		self: Cadence,
		children: Cadence[],
		date: isoly.Date,
		{ cap = undefined }: { cap?: number } = {}
	): number {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		cap = Math.max(allocated(self, date), cap ?? 0) - singles.reduce((result, cadence) => result + cadence.value, 0)

		const max = dayDiff(date, self.created)
		const approximation = Math.max(0, Math.min(max, approximate(self, children, date, { cap })))

		const childCost = children.reduce(
			(result, cadence) => result + allocated(cadence, isoly.Date.next(self.created, approximation)),
			0
		)
		let days: number
		if (childCost <= cap)
			for (days = approximation; days < max; days++) {
				const next = isoly.Date.next(self.created, days)
				const sum = cadences.reduce((r, c) => r + allocated(c, next), 0)
				if (sum >= cap)
					break
			}
		else
			for (days = approximation; days > -1; days--) {
				const next = isoly.Date.next(self.created, days)
				const sum = cadences.reduce((r, c) => r + allocated(c, next), 0)
				if (sum <= cap)
					break
			}
		return days
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
