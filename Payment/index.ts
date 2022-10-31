import { Amount } from "../Amount"
import { Card as CardPayment } from "./Card"

export interface Payment {
	type: string
	limit: Amount
}

export namespace Payment {
	export function is(value: Payment | any): value is Payment {
		return typeof value == "object" && value && typeof value.type == "string" && Amount.is(value.limit)
	}

	export function validate(payment: Payment, limit?: Amount): boolean {
		return Amount.validate(payment.limit, limit)
	}
	export type Card = CardPayment
	export const Card = CardPayment
}
