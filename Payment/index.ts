import { Amount } from "../Amount"
import { Card as CardPayment } from "./Card"

export type Payment = CardPayment

export namespace Payment {
	export function is(value: Payment | any): value is Payment {
		return CardPayment.is(value)
	}

	export function validate(payment: Payment, limit?: Amount): boolean {
		return Amount.validate(payment.limit, limit)
	}
	export type Card = CardPayment
	export const Card = CardPayment
}
