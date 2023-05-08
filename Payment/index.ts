import { Amount } from "../Amount"
import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Payment = Payment.Card | Payment.PrePaid
export namespace Payment {
	export function is(value: Payment | any): value is Payment {
		return Card.is(value) || PrePaid.is(value) || Expense.is(value)
	}

	export function validate(payment: Payment, limit?: Amount): boolean {
		return Card.is(payment)
			? Card.validate(payment, limit)
			: PrePaid.is(payment)
			? PrePaid.validate(payment, limit)
			: Expense.validate(payment, limit)
	}
	export type Card = PaymentCard
	export const Card = PaymentCard
	export type PrePaid = PaymentPrePaid
	export const PrePaid = PaymentPrePaid
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export type Expense = PaymentExpense
	export const Expense = PaymentExpense
	export namespace Creatable {
		export type PrePaid = PaymentCreatable.PrePaid
		export type Card = PaymentCreatable.Card
		export type Expense = PaymentCreatable.Expense
	}
}
