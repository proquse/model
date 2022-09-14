import { Amount } from "../Amount"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable // { type: "card", limit: Amount}
	buyer: string
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			Payment.Creatable.is(value.payment) &&
			typeof value.buyer == "string"
		)
	}
	export function validate(value: Creatable, limit?: Amount) {
		return (
			!!value.buyer && !!value.purpose && Amount.validate(value.payment.limit, limit) && value.payment.type == "card"
		)
	}
}
