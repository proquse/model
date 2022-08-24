import * as isoly from "isoly"

export type Amount = [number, isoly.Currency]
export namespace Amount {
	export function is(value: Amount | any): value is Amount {
		return Array.isArray(value) && value.length == 2 && typeof value[0] == "number" && isoly.Currency.is(value[1])
	}
	export function validate(value: Amount, limit?: Amount) {
		return value[0] > 0 && (limit == undefined || (value[0] <= limit[0] && value[1] == limit[1]))
	}
}
