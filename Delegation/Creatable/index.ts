import { Amount } from "../../Amount"

export interface Creatable {
	to: string[]
	purpose: string
	amount: Amount
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			Array.isArray(value.to) &&
			value.to.every((v: any) => typeof v == "string") &&
			Amount.is(value.amount)
		)
	}
	export function equals(first: Creatable | any, second: Creatable | any) {
		return (
			is(first) &&
			is(second) &&
			first.purpose == second.purpose &&
			first.amount.every((value, index) => value == second.amount[index]) &&
			first.to.length == second.to.length &&
			first.to.every((value, index) => value == second.to[index])
		)
	}
	export function create(to?: string[], purpose?: string, amount?: Amount): Creatable {
		return { to: to ?? [], purpose: purpose ?? "", amount: amount ?? [0, "EUR"] }
	}
	export function validate(value: Creatable, limit: Amount) {
		return value.to.length >= 0 && !value.to.some(to => !to) && !!value.purpose && Amount.validate(value.amount, limit)
	}
}
