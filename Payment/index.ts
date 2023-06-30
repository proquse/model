import { isly } from "isly"
import { Amount } from "../Amount"
import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Payment = Payment.Card | Payment.PrePaid | Payment.Expense
export namespace Payment {
	export const type = isly.union(PaymentCard.type, PaymentExpense.type, PaymentPrePaid.type)
	export const is = type.is
	export const flaw = type.flaw

	export function validate(payment: Payment, limit?: Amount): boolean {
		return Card.is(payment)
			? Card.validate(payment, limit)
			: PrePaid.is(payment)
			? PrePaid.validate(payment, limit)
			: Expense.validate(payment, limit)
	}
	export type Card = PaymentCard
	export const Card = PaymentCard
	export namespace Card {
		export type Creatable = PaymentCard.Creatable
	}
	export type PrePaid = PaymentPrePaid
	export const PrePaid = PaymentPrePaid
	export namespace PrePaid {
		export type Creatable = PaymentPrePaid.Creatable
	}
	export type Expense = PaymentExpense
	export const Expense = PaymentExpense
	export namespace Expense {
		export type Reimbursement = PaymentExpense.Reimbursement
		export type Creatable = PaymentExpense.Creatable
		export namespace Reimbursement {
			export type Creatable = PaymentExpense.Reimbursement.Creatable
		}
	}
	export type Creatable = PaymentCreatable
	export const Creatable = PaymentCreatable
	export namespace Creatable {
		export type PrePaid = PaymentCreatable.PrePaid
		export type Card = PaymentCreatable.Card
		export type Expense = PaymentCreatable.Expense
	}
}
