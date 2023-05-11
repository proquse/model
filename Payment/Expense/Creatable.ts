import { Amount } from "../../Amount"

export interface Creatable {
	type: "expense"
	limit: Amount
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return typeof value == "object" && value && value.type == "expense" && Amount.is(value.limit)
	}
	export function validate(expense: Creatable, limit?: Amount) {
		return Amount.validate(expense.limit, limit)
	}
}
