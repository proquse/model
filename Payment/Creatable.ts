import { Amount } from "../Amount"
import { Card as PaymentCard } from "./Card"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Creatable = Creatable.Card | Creatable.PrePaid | Creatable.Expense

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return Card.is(value) || PrePaid.is(value) || Expense.is(value)
	}

	export function validate(payment: Creatable, limit?: Amount): boolean {
		return Card.is(payment)
			? Card.validate(payment, limit)
			: PrePaid.is(payment)
			? PrePaid.validate(payment, limit)
			: Expense.validate(payment, limit)
	}

	export type Card = PaymentCard.Creatable
	export const Card = PaymentCard.Creatable
	export type PrePaid = PaymentPrePaid.Creatable
	export const PrePaid = PaymentPrePaid.Creatable
	export type Expense = PaymentExpense.Creatable
	export const Expense = PaymentExpense.Creatable
}
