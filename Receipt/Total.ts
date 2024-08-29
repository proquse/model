import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import { Validation as TotalValidation } from "../Validation"
export interface Total {
	net: Amount
	vat: Amount
}
export namespace Total {
	export const type = isly.object<Total>({ net: Amount.type, vat: Amount.type })
	export const is = type.is
	export const flaw = type.flaw
	export type Validation = TotalValidation<Total>
	export function validate(total: Total, currency: isoly.Currency): Validation {
		return { status: true }
	}

	export function spent(total: Total, currency: isoly.Currency): number {
		return isoly.Currency.add(currency, total.net.value, total.vat.value)
	}
}
