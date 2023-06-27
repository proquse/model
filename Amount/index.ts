import { isoly } from "isoly"
import { isly } from "isly"

export interface Amount {
	cadence: "year" | "month" | "week" | "single"
	value: number
	currency: isoly.Currency
	created: isoly.Date
}
export namespace Amount {
	export const type = isly.object<Amount>({
		cadence: isly.union(isly.string("year"), isly.string("month"), isly.string("week"), isly.string("single")),
		value: isly.number(),
		currency: isly.fromIs("Currency", isoly.Currency.is),
		created: isly.fromIs("Date", isoly.Date.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function allocated(amount: Amount, date: isoly.Date): number {
		let result = 0
		if (amount.created <= date) {
			if (amount.cadence == "year")
				for (let d = isoly.Date.firstOfYear(amount.created); d <= date; d = isoly.Date.nextYear(d))
					result += amount.value
			else if (amount.cadence == "month")
				for (let d = isoly.Date.firstOfMonth(amount.created); d <= date; d = isoly.Date.nextMonth(d))
					result += amount.value
			else if (amount.cadence == "week") {
				for (let d = isoly.Date.firstOfWeek(amount.created); d <= date; d = isoly.Date.next(d, 7))
					result += amount.value
			} else
				result = amount.value
		}
		return result
	}
	export function validate(amount: Amount, date: isoly.Date, limit?: Amount): boolean {
		const cap = !limit ? undefined : Amount.allocated(limit, date)
		const allocated = Amount.allocated(amount, date)
		return allocated > 0 && (!cap || (allocated <= cap && amount.currency == limit?.currency))
	}
}
