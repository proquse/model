import * as isoly from "isoly"

export interface Creatable {
	type: "card"
	limit?: [number, isoly.Currency]
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			value.type == "card" &&
			(typeof value.limit == "undefined" ||
				(Array.isArray(value.limit) &&
					value.limit.length == 2 &&
					typeof value.limit[0] == "number" &&
					isoly.Currency.is(value.limit[1])))
		)
	}
}
