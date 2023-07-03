import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"

export interface Cadence extends Amount {
	interval: Cadence.Interval
	created: isoly.Date
}
export namespace Cadence {
	export const intervals = ["single", "week", "month", "year"] as const
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
			} else
				result = cadence.value
		}
		return result
	}
}
