import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
export interface Total {
	net: Amount
	vat: Amount
}
export namespace Total {
	export const type = isly.object<Total>({ net: Amount.type, vat: Amount.type })
	export const is = type.is
	export const flaw = type.flaw
	export function validate(total: Total, currency: isoly.Currency): boolean {
		return currency == total.net.currency && currency == total.vat.currency
	}
	// missing tests. maybe use in purchase? unused.
	export function spent(total: Total, currency: isoly.Currency): number {
		return isoly.Currency.add(currency, total.net.value, total.vat.value)
	}
}
