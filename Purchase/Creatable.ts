import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment
	buyer: string
}

export namespace Creatable {
	export const type = isly.object<Creatable>({ purpose: isly.string(), payment: Payment.type, buyer: isly.string() })
	export const is = type.is
	export const flaw = type.flaw

	export function validate(purchase: Creatable, limit?: Cadence): boolean {
		return !!purchase.buyer && Payment.Creatable.validate(purchase.payment, limit)
	}
}
