import { Amount } from "../Amount"
import { Card as CardPayment } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"

export type Payment = CardPayment

export namespace Payment {
	export const is = CardPayment.is
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export function create(payment: Creatable, card: string): Payment {
		return {
			...payment,
			card: card,
		}
	}
	export function validate(value: Payment, limit?: Amount) {
		return value.type == "card" && (limit == undefined || CardPayment.validate(value, limit)) && value.card != ""
	}
	export type Card = CardPayment
	export namespace Card {
		export const is = CardPayment.is
		export const validate = CardPayment.validate
		export type Creatable = CardPayment.Creatable
		export namespace Creatable {
			export const is = CardPayment.Creatable.is
			export const validate = CardPayment.Creatable.validate
		}
		export type Token = CardPayment.Token
		export namespace Token {
			export const is = CardPayment.Token.is
		}
	}
}
