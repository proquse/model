import { Amount } from "../../Amount"

export interface Creatable {
	type: "pre-paid"
	limit: Amount
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return typeof value == "object" && value && value.type == "pre-paid" && Amount.is(value.limit)
	}
	export function validate(prePaid: Creatable, limit?: Amount): boolean {
		return Amount.validate(prePaid.limit, limit)
	}
}
