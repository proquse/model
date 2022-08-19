import * as isoly from "isoly"
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
	export function create(to?: string[], purpose?: string, currency?: isoly.Currency): Creatable {
		return { to: to ?? [], purpose: purpose ?? "", amount: [0, currency ?? "EUR"] }
	}
}
