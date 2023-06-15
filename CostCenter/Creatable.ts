import { isly } from "isly"
import { Amount } from "../Amount"

export interface Creatable {
	from: string //email
	costCenter: string
	amount: Amount
	purpose?: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: isly.string(),
		costCenter: isly.string(),
		amount: Amount.type,
		purpose: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function validate(costCenter: Creatable, limit?: Amount) {
		return (
			!!costCenter.from && !!costCenter.costCenter && Amount.validate(costCenter.amount, limit) && !!costCenter.purpose
		)
	}
}
