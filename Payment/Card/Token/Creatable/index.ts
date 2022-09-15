import { Amount } from "../../../../Amount"

export interface Creatable {
	type: "card"
	limit: Amount
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return typeof value == "object" && value.type == "card" && Amount.is(value.limit)
	}
	export function validate(value: Creatable, limit?: Amount) {
		return Amount.validate(value.limit, limit)
	}
}
