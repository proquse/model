import * as isoly from "isoly"

export type Amount = [number, isoly.Currency]
export namespace Amount {
	export function is(value: Amount | any): value is Amount {
		return Array.isArray(value) && value.length == 2 && typeof value[0] == "number" && isoly.Currency.is(value[1])
	}
	export function validate(amount: Amount, limit?: Amount): boolean {
		return amount[0] > 0 && (limit == undefined || (amount[0] <= limit[0] && amount[1] == limit[1]))
	}
}
