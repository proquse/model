import * as isoly from "isoly"

export interface Creatable {
	to: string[]
	purpose: string
	amount: [number, isoly.Currency]
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			Array.isArray(value.to) &&
			value.to.every((v: any) => typeof v == "string") &&
			Array.isArray(value.amount) &&
			value.amount.length == 2 &&
			typeof value.amount[0] == "number" &&
			isoly.Currency.is(value.amount[1])
		)
	}
}
