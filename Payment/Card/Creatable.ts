import { Amount } from "../../Amount"

export interface Creatable {
	type: "card"
	limit: Amount
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return typeof value == "object" && value && value.type == "card" && Amount.is(value.limit)
	}
	export function validate(card: Creatable, limit?: Amount): boolean {
		return Amount.validate(card.limit, limit)
	}
}
