import { isly } from "isly"
import { Amount } from "../Amount"
import { Card as PaymentCard } from "./Card"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Creatable = Creatable.Card | Creatable.PrePaid | Creatable.Expense

export namespace Creatable {
	export const type = isly.union<Creatable, Creatable.Card, Creatable.PrePaid, Creatable.Expense>(
		PaymentCard.Creatable.type,
		PaymentPrePaid.Creatable.type,
		PaymentExpense.Creatable.type
	)
	export const is = type.is
	export const flaw = type.flaw

	export function validate(payment: Creatable, limit?: Amount): boolean {
		return Card.is(payment)
			? Card.validate(payment, limit)
			: PrePaid.is(payment)
			? PrePaid.validate(payment, limit)
			: Expense.validate(payment, limit)
	}

	export type Card = PaymentCard.Creatable
	export const Card = PaymentCard.Creatable
	export namespace Card {
		export type Creatable = PaymentCard.Creatable
	}
	export type PrePaid = PaymentPrePaid.Creatable
	export const PrePaid = PaymentPrePaid.Creatable
	export namespace PrePaid {
		export type Creatable = PaymentPrePaid.Creatable
	}
	export type Expense = PaymentExpense.Creatable
	export const Expense = PaymentExpense.Creatable
	export namespace Expense {
		export type Creatable = PaymentExpense.Creatable
	}
}
