import { isly } from "isly"
import { Amount } from "../Amount"

export interface Creatable {
	from: string
	to: string[]
	purpose: string
	amount: Amount
	costCenter: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: isly.string(),
		to: isly.array(isly.string(), { criteria: "minLength", value: 1 }),
		purpose: isly.string(),
		amount: Amount.type,
		costCenter: isly.string(),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function equals(first: Creatable | any, second: Creatable | any) {
		return (
			is(first) &&
			is(second) &&
			first.costCenter == second.costCenter &&
			first.purpose == second.purpose &&
			first.amount.every((value, index) => value == second.amount[index]) &&
			first.to.length == second.to.length &&
			first.to.every((value, index) => value == second.to[index])
		)
	}
	export function validate(delegation: Creatable, limit?: Amount): boolean {
		return (
			!!delegation.purpose &&
			Amount.validate(delegation.amount, limit) &&
			!!delegation.costCenter &&
			delegation.to.length > 0 &&
			delegation.to.every(email => !!email)
		)
	}
}
