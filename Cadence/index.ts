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
	export function allocated(cadence: Cadence, date: isoly.Date): number {
		let result = 0
		if (cadence.created <= date) {
			if (cadence.interval == "year")
				for (let d = isoly.Date.firstOfYear(cadence.created); d <= date; d = isoly.Date.nextYear(d))
					result += cadence.value
			else if (cadence.interval == "month")
				for (let d = isoly.Date.firstOfMonth(cadence.created); d <= date; d = isoly.Date.nextMonth(d))
					result += cadence.value
			else if (cadence.interval == "week") {
				for (let d = isoly.Date.firstOfWeek(cadence.created); d <= date; d = isoly.Date.next(d, 7))
					result += cadence.value
			} else if (cadence.interval == "day") {
				for (let d = cadence.created; d <= date; d = isoly.Date.next(d, 1))
					result += cadence.value
			} else
				result = cadence.value
		}
		return result
	}
	function partition<T>(array: T[], filter: (item: T) => boolean): [T[], T[]] {
		const pass: T[] = []
		const fail: T[] = []
		array.forEach(item => (filter(item) ? pass.push(item) : fail.push(item)))
		return [pass, fail]
	}
	export function sustainable(self: Cadence, children: Cadence[], date: isoly.Date, options?: { cap?: number }) {
		const [cadences, singles] = partition(children, child => child.interval != "single")
		const y =
			Math.max(allocated(self, date), options?.cap ?? 0) - // 140
			singles.reduce((result, cadence) => result + cadence.value, 0) // 140
		const costPerDayPerCadence = cadences.map(cadence => {
			const days = Math.abs((new Date(date).getTime() - new Date(cadence.created).getTime()) / 1000 / 3600 / 24) + 1
			// const hours = isoly.DateTime.epoch(date, "hours") - isoly.DateTime.epoch(cadence.created, "hours")
			// const days = Math.trunc(Math.abs(isoly.TimeSpan.toHours(span)) / 24) + 1
			const allocated = Cadence.allocated(cadence, date)
			return isoly.Currency.divide(cadence.currency, allocated, days)
		})
		const numerator =
			y +
			cadences.reduce((result, cadence, index) => {
				const t = Math.abs(
					(new Date(self.created).getTime() - new Date(cadence.created).getTime()) / 1_000 / 3_600 / 24
				)
				// const t = Math.trunc(Math.abs(isoly.TimeSpan.toHours(isoly.Date.span(self.created, cadence.created)) / 24))
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
