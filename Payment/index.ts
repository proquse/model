import { Amount } from "../Amount"
import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Payment = Payment.Card | Payment.PrePaid
export namespace Payment {
	export function is(value: Payment | any): value is Payment {
		return Card.is(value) || PrePaid.is(value)
	}

	export function validate(payment: Payment, limit?: Amount): boolean {
		return Amount.validate(payment.limit, limit)
	}
	export type Card = PaymentCard
	export const Card = PaymentCard
	export type PrePaid = PaymentPrePaid
	export const PrePaid = PaymentPrePaid
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export namespace Creatable {
		export type PrePaid = PaymentCreatable.PrePaid
		export type Card = PaymentCreatable.Card
	}
}
