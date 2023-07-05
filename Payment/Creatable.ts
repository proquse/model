import { isly } from "isly"
import { Card as PaymentCard } from "./Card"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Creatable = Creatable.Card | Creatable.PrePaid | Creatable.Expense

export namespace Creatable {
	export const type = isly.union(
		PaymentExpense.Creatable.type,
		PaymentCard.Creatable.type,
		PaymentPrePaid.Creatable.type
	)
	export const is = type.is
	export const flaw = type.flaw

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
