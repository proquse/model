import { Amount } from "../../../../Amount"

export interface Creatable {
	type: "card"
	limit: Amount
}

export namespace Creatable {
	export function is(token: Creatable | any): token is Creatable & Record<string, any> {
		return typeof token == "object" && token.type == "card" && Amount.is(token.limit)
	}
	export function validate(value: Creatable, limit?: Amount): boolean {
		return Amount.validate(value.limit, limit)
	}
}
