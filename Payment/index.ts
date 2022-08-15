import { Card } from "../Card"
import { Creatable as PaymentCreatable } from "./Creatable"

export type Payment = Card

export namespace Payment {
	export const is = Card.is
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
}
