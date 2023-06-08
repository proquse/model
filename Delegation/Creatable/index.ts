import { isly } from "isly"
import { Amount } from "../../Amount"

export interface Creatable {
	to: string[]
	purpose: string
	amount: Amount
	costCenter: string
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		to: isly.array(isly.string()),
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
	export function create(to?: string[], purpose?: string, amount?: Amount, costCenter?: string): Creatable {
		return {
			to: to ?? [],
			purpose: purpose ?? "",
			amount: amount ?? [0, "EUR"],
			costCenter: costCenter ?? "",
		}
	}
	export function validate(delegation: Creatable, limit?: Amount, costCenter = false): boolean {
		return (
			!!delegation.purpose &&
			Amount.validate(delegation.amount, limit, costCenter) &&
			!!delegation.costCenter &&
			(!costCenter ? delegation.to.length > 0 && !delegation.to.some(to => !to) : delegation.to.length == 0)
		)
	}
}
