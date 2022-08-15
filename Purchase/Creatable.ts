import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable & Record<string, any> {
		return typeof value == "object" && typeof value.purpose == "string" && Payment.Creatable.is(value.payment)
	}
}
