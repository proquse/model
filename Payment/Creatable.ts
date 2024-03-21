import { isly } from "isly"
import { Creatable as PaymentCard } from "./Card/Creatable"
import { Creatable as PaymentExpense } from "./Expense/Creatable"
import { Creatable as PaymentPrePaid } from "./PrePaid/Creatable"

export type Creatable = Creatable.Card | Creatable.Expense | Creatable.PrePaid

export namespace Creatable {
	export import Card = PaymentCard
	export import Expense = PaymentExpense
	export import PrePaid = PaymentPrePaid
	export const type = isly.union<Creatable, Card, Expense, PrePaid>(Card.type, Expense.type, PrePaid.type)
	export const is = type.is
	export const flaw = type.flaw
}
