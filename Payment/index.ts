import { isly } from "isly"
import { Card as PaymentCard } from "./Card"
import { Creatable as PaymentCreatable } from "./Creatable"
import { Currencies as PaymentCurrencies } from "./Currencies"
import { exchange as PaymentExchange } from "./exchange"
import { Expense as PaymentExpense } from "./Expense"
import { PrePaid as PaymentPrePaid } from "./PrePaid"

export type Payment = Payment.Card | Payment.Expense | Payment.PrePaid
export namespace Payment {
	export import Creatable = PaymentCreatable
	export import Card = PaymentCard
	export import Expense = PaymentExpense
	export import PrePaid = PaymentPrePaid
	export import Currencies = PaymentCurrencies
	export const type = isly.union<Payment, Card, Expense, PrePaid>(Card.type, Expense.type, PrePaid.type)
	export const is = type.is
	export const flaw = type.flaw

	export const exchange = PaymentExchange
}
