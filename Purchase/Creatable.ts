import { Amount } from "../Amount"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment
	buyer: string
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			Payment.is(value.payment) &&
			typeof value.buyer == "string"
		)
	}
	export function validate(purchase: Creatable, limit?: Amount): boolean {
		return !!purchase.buyer && Payment.Creatable.validate(purchase.payment, limit)
	}
}
