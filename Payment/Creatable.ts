import { Amount } from "../Amount"
import { Creatable as CardCreatable } from "./Card/Creatable"
import { Creatable as PrePaidCreatable } from "./PrePaid/Creatable"

export type Creatable = Creatable.Card | Creatable.PrePaid

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return Card.is(value) || PrePaid.is(value)
	}

	export function validate(payment: Creatable, limit?: Amount): boolean {
		return Card.is(payment) ? Card.validate(payment, limit) : PrePaid.validate(payment, limit)
	}

	export type Card = CardCreatable
	export const Card = CardCreatable
	export type PrePaid = PrePaidCreatable
	export const PrePaid = PrePaidCreatable
}
