import { isly } from "isly"
import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Payment = Payment.Card | Payment.Expense | Payment.PrePaid
export namespace Payment {
	export import Creatable = PaymentCreatable
	export import Card = PaymentCard
	export import Expense = PaymentExpense
	export import PrePaid = PaymentPrePaid
	export const type = isly.union<Payment, Card, Expense, PrePaid>(Card.type, Expense.type, PrePaid.type)
	export const is = type.is
	export const flaw = type.flaw
}
