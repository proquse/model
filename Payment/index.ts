import { Amount } from "../Amount"
import { Card } from "../Card"
import { Creatable as PaymentCreatable } from "./Creatable"

export type Payment = Card

export namespace Payment {
	export const is = Card.is
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export function create(payment: Creatable, card: string): Payment {
		return {
			...payment,
			card: card,
		}
	}
	export function validate(value: Payment, limit?: Amount) {
		return value.type == "card" && (limit == undefined || Card.validate(value, limit)) && value.card != ""
	}
}
