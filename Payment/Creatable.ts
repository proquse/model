import { isly } from "isly"
import { Card as PaymentCard } from "./Card"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Creatable = Creatable.Card | Creatable.Card.Internal | Creatable.Expense | Creatable.PrePaid

export namespace Creatable {
	export import Card = PaymentCard
	export import Expense = PaymentExpense
	export import PrePaid = PaymentPrePaid
	export const type = isly.union<Creatable, Card, Card.Internal, Expense, PrePaid>(
		Card.Creatable.type,
		Card.Internal.Creatable.type,
		Expense.type,
		PrePaid.type
	)
	export const is = type.is
	export const flaw = type.flaw
}
