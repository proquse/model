import * as isoly from "isoly"

export type Amount = [number, isoly.Currency]
export namespace Amount {
	export function is(value: Amount | any): value is Amount {
		return (
			Array.isArray(value) &&
			value.length == 2 &&
			typeof value[0] == "number" &&
			!isNaN(value[0]) &&
			isoly.Currency.is(value[1])
		)
	}
	export function validate(amount: Amount, limit?: Amount, costCenter = false): boolean {
		return (
			(!costCenter ? amount[0] > 0 : amount[0] >= 0) &&
			(limit == undefined || (amount[0] <= limit[0] && amount[1] == limit[1]))
		)
	}
}
