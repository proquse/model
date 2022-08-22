import * as isoly from "isoly"

export type Amount = [number, isoly.Currency]
export namespace Amount {
	export function is(value: Amount | any): value is Amount {
		return Array.isArray(value) && value.length == 2 && typeof value[0] == "number" && isoly.Currency.is(value[1])
	}
	export function validate(value: Amount, limit?: number, currency?: isoly.Currency) {
		return value[0] > 0 && (limit == undefined || value[0] <= limit) && (currency == undefined || value[1] == currency)
	}
}
