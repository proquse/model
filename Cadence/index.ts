import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"

export interface Cadence extends Amount {
	cadence: "year" | "month" | "week" | "single"
	created: isoly.Date
}
export namespace Cadence {
	export const type = Amount.type.extend<Cadence>({
		cadence: isly.union(isly.string("year"), isly.string("month"), isly.string("week"), isly.string("single")),
		created: isly.fromIs("Date", isoly.Date.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function allocated(cadence: Cadence, date: isoly.Date): number {
		let result = 0
		if (cadence.created <= date) {
			if (cadence.cadence == "year")
				for (let d = isoly.Date.firstOfYear(cadence.created); d <= date; d = isoly.Date.nextYear(d))
					result += cadence.value
			else if (cadence.cadence == "month")
				for (let d = isoly.Date.firstOfMonth(cadence.created); d <= date; d = isoly.Date.nextMonth(d))
					result += cadence.value
			else if (cadence.cadence == "week") {
				for (let d = isoly.Date.firstOfWeek(cadence.created); d <= date; d = isoly.Date.next(d, 7))
					result += cadence.value
			} else
				result = cadence.value
		}
		return result
	}
	export function validate(cadence: Cadence, date: isoly.Date, limit?: Cadence): boolean {
		const cap = !limit ? undefined : Cadence.allocated(limit, date)
		const allocated = Cadence.allocated(cadence, date)
		return allocated > 0 && (!cap || (allocated <= cap && cadence.currency == limit?.currency))
	}
}
