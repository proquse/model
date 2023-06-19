import { isly } from "isly"
import { Amount } from "../../Amount"

export interface Creatable {
	type: "card"
	limit: Amount
}
export namespace Creatable {
	export const type = isly.object<Creatable>({ type: isly.string(["card"]), limit: Amount.type })
	export const is = type.is
	export const flaw = type.flaw
	export function validate(card: Creatable, limit?: Amount): boolean {
		return Amount.validate(card.limit, limit)
	}
}
