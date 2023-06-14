import { isly } from "isly"
import { Amount } from "../../Amount"

export interface Creatable {
	type: "pre-paid"
	limit: Amount
}
export namespace Creatable {
	export const type = isly.object<Creatable>({ type: isly.string(["pre-paid"]), limit: Amount.type })
	export const is = type.is
	export const flaw = type.flaw

	export function validate(prePaid: Creatable, limit?: Amount): boolean {
		return Amount.validate(prePaid.limit, limit)
	}
}
