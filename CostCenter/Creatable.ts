import { isly } from "isly"
import { Cadence } from "../Cadence"

export interface Creatable {
	from: string //email
	name: string
	amount: Cadence
	description?: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: isly.string(),
		name: isly.string(),
		amount: Amount.type,
		description: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function validate(costCenter: Creatable, limit?: Cadence): boolean {
		return !!costCenter.from && !!costCenter.name && Amount.validate(costCenter.amount, limit)
	}
}
