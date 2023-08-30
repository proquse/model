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
	export function sustainable(
		self: Cadence,
		children: Cadence[],
		date: isoly.Date,
		options?: { cap?: number; approximation?: number }
	): number {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		const cap =
			Math.max(allocated(self, date), options?.cap ?? 0) -
			singles.reduce((result, cadence) => result + cadence.value, 0)

		let days = 0
		for (
			let d = self.created;
			cadences.reduce((r, c) => r + allocated(c, d, { cap }), 0) <= cap;
			d = d = isoly.Date.next(d, 1)
		)
			days += 1
		// const approximation = approximateSustainable(self, children, date, { cap })
		// const approximatedDate = isoly.Date.next(self.created, approximation)
		// const childCost = children.reduce((result, cadence) => result + allocated(cadence, approximatedDate, { cap }), 0)
		// const direction = childCost <= cap ? 1 : -1

		// let days = 0
		// for (
		// 	let d = approximatedDate;
		// 	cadences.reduce((r, c) => r + allocated(c, d, { cap }) * direction, 0) <= cap;
		// 	d = isoly.Date.next(d, 1)
		// )
		// 	days += direction
		return days
	}
	export function approximateSustainable(
		self: Cadence,
		children: Cadence[],
		date: isoly.Date,
		options?: { cap?: number }
	) {
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
