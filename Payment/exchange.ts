import { isoly } from "isoly"
import type { Cadence } from "../Cadence"
import type { Payment } from "./index"

export function exchange(payment: Payment.Creatable, currency: isoly.Currency): Cadence | undefined {
	const rate = payment?.rates?.[currency]
	return payment.limit.currency == currency
		? payment.limit
		: !rate
		? undefined
		: { ...payment.limit, value: isoly.Currency.multiply(currency, payment.limit.value, rate) }
}
