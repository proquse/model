import { isly } from "isly"
import { Amount } from "../../Amount"

export interface Creatable {
	type: "expense"
	limit: Amount
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		type: isly.string(["expense"]),
		limit: Amount.type,
	})
	export const is = type.is
	export const flaw = type.flaw
	export function validate(expense: Creatable, limit?: Amount) {
		return Amount.validate(expense.limit, limit)
	}
}
