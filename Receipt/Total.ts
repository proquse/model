import { isoly } from "isoly"
import { Amount } from "../Amount"

export interface Total {
	net: Amount
	vat: Amount
}
export namespace Total {
	export function is(value: Total | any): value is Total {
		return typeof value == "object" && value && Amount.is(value.net) && Amount.is(value.vat)
	}
	export function validate(total: Total, currency: isoly.Currency): boolean {
		return currency == total.net[1] && total.net[1] == total.vat[1]
	}
}
