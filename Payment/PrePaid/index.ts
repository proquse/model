import { Amount } from "../../Amount"
import { Creatable as PrePaidCreatable } from "./Creatable"

export interface PrePaid {
	type: "pre-paid"
	limit: Amount
}

export namespace PrePaid {
	export function is(value: PrePaid | any): value is PrePaid {
		return typeof value == "object" && value && value.type == "pre-paid" && Amount.is(value.limit)
	}
	export const validate = PrePaidCreatable.validate
	export type Creatable = PrePaidCreatable
	export const Creatable = PrePaidCreatable
}
