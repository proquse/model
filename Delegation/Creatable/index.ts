import { Amount } from "../../Amount"

export interface Creatable {
	to: string[]
	purpose: string
	amount: Amount
	costCenter: string
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			(typeof value.costCenter == "undefined" || typeof value.costCenter == "string") &&
			Array.isArray(value.to) &&
			value.to.every((v: any) => typeof v == "string") &&
			Amount.is(value.amount)
		)
	}
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
