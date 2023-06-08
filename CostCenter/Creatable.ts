import { isly } from "isly"
import { Amount } from "../Amount"

export interface Creatable {
	from: string //email
	costCenter: string
	amount: Amount
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: isly.string(),
		costCenter: isly.string(),
		amount: Amount.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
