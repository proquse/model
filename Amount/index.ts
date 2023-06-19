import { isoly } from "isoly"
import { isly } from "isly"

export type Amount = [number, isoly.Currency]
export namespace Amount {
	export const type = isly.tuple<Amount>(isly.number(), isly.fromIs<isoly.Currency>("Currency", isoly.Currency.is))
	export const is = type.is
	export const flaw = type.flaw
	export function validate(amount: Amount, limit?: Amount): boolean {
		return amount[0] > 0 && (limit == undefined || (amount[0] <= limit[0] && amount[1] == limit[1]))
	}
}
