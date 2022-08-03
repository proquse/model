import * as isoly from "isoly"
import { Amount } from "../../Amount"

export interface Creatable {
	type: "card"
	limit?: [number, isoly.Currency]
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" && value.type == "card" && (typeof value.limit == "undefined" || Amount.is(value.limit))
		)
	}
}
