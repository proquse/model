import { isly } from "isly"
import { Email } from "../Email"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
	buyer: Email
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		purpose: isly.string(/.+/),
		payment: Payment.Creatable.type,
		buyer: Email.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
