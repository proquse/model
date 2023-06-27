import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
	buyer: string
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		purpose: isly.string(),
		payment: Payment.Creatable.type,
		buyer: isly.string(),
	})
	export const is = type.is
	export const flaw = type.flaw

	export function validate(purchase: Creatable, date: isoly.Date, limit?: Cadence): boolean {
		return !!purchase.buyer && Payment.Creatable.validate(purchase.payment, date, limit)
	}
}
