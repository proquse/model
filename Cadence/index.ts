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
	export function allocated(cadence: Cadence, date: isoly.Date, options?: { cap?: number }): number {
		let result = 0
		if (isoly.DateTime.getDate(cadence.created) <= date) {
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
				result = Math.max(0, Math.trunc(duration(date, initial) / 7) * cadence.value + cadence.value)
			} else if (cadence.interval == "day")
				result = Math.max(0, duration(date, cadence.created) * cadence.value + cadence.value)
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
	/**
	 * formula described here https://github.com/issuefab/app/issues/232
	 */
	function approximate(self: Cadence, children: Cadence[], date: isoly.Date, options?: { cap?: number }): number {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		const funds =
			Math.max(allocated(self, date), options?.cap ?? 0) -
			singles.reduce((result, cadence) => result + cadence.value, 0)
		const rates = cadences.map(cadence => {
			const days = Math.abs(duration(date, cadence.created)) + 1
			const allocated = Cadence.allocated(cadence, date)
			return isoly.Currency.divide(cadence.currency, allocated, days)
		})
		const numerator =
			funds +
			cadences.reduce((result, cadence, index) => {
				const time = Math.abs(duration(cadence.created, self.created))
				const rate = rates[index]
				return result + rate * time
			}, 0)
		const denominator = rates.reduce((result, cost) => result + cost, 0)
		const result = numerator / denominator
		return Math.trunc(result)
	}
	/**
	 * Potential optimizations:
	 * 1: dynamically change the next function
	 * and use it for iteration
	 * 2: improve the approximation by changing "y"
	 * in the formula to be any line instead of constant
	 * 3: steps in bigger increments and go backwards if overshooting
	 * 4: frontend can put the work in a background worker
	 */
	export function sustainable(
		self: Cadence,
		children: Cadence[],
		date: isoly.Date,
		options?: { cap?: number }
	): number {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		// which one to use?
		// const t0 = Math.min(...[allocated(self, date)].concat(options?.cap ?? []))
		// const t1 = options?.cap == undefined ? allocated(self, date) : Math.min(allocated(self, date), options.cap)
		// const t2 = Math.min(allocated(self, date), options?.cap ?? Number.MAX_SAFE_INTEGER)
		const cap =
			Math.min(...[allocated(self, date)].concat(options?.cap ?? [])) -
			singles.reduce((result, cadence) => result + cadence.value, 0)

		const max = duration(date, self.created)
		const approximation = Math.max(0, Math.min(max, approximate(self, children, date, { cap })))
		const approximationDate = isoly.Date.next(self.created, approximation)
		const childCost = children.reduce((result, cadence) => result + allocated(cadence, approximationDate), 0)
		const approximateCap =
			Math.min(allocated(self, approximationDate), cap) - singles.reduce((result, cadence) => result + cadence.value, 0)

		let days: number
		if (childCost <= approximateCap)
			for (days = approximation; days < max; days++) {
				const next = isoly.Date.next(self.created, days)
				const cap =
					Math.min(allocated(self, next), approximateCap) -
					singles.reduce((result, cadence) => result + cadence.value, 0)
				const sum = cadences.reduce((r, c) => r + allocated(c, next), 0)
				if (sum >= cap)
					break
			}
		else
			for (days = approximation; days > -1; days--) {
				const next = isoly.Date.next(self.created, days)
				const cap =
					Math.min(allocated(self, next), approximateCap) -
					singles.reduce((result, cadence) => result + cadence.value, 0)
				const sum = cadences.reduce((r, c) => r + allocated(c, next), 0)
				if (sum <= cap)
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
