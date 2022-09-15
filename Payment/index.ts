import { Card as CardPayment } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"

export type Payment = CardPayment.Token

export namespace Payment {
	export const is = CardPayment.Token.is
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export const create = CardPayment.Token.create
	export const validate = CardPayment.Token.validate
	export type Card = CardPayment
	export namespace Card {
		export const is = CardPayment.is
		export type Token = CardPayment.Token
		export namespace Token {
			export const is = CardPayment.Token.is
			export const validate = CardPayment.Token.validate
			export type Creatable = CardPayment.Token.Creatable
			export namespace Creatable {
				export const is = CardPayment.Token.Creatable.is
				export const validate = CardPayment.Token.Creatable.validate
			}
		}
	}
}
