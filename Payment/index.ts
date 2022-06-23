import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"

export type Payment = PaymentCard

export namespace Payment {
	export type Creatable = PaymentCreatable
	export type Card = PaymentCard
	export namespace Card {
		export type Creatable = PaymentCard.Creatable
	}
}
