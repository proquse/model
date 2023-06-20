import { isly } from "isly"
import { Amount } from "../Amount"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
	buyer: string
}

export namespace Creatable {
	export const type = isly.object<Creatable>({ purpose: isly.string(), payment: Payment.type, buyer: isly.string() })
	export const is = type.is
	export const flaw = type.flaw

	export function validate(purchase: Creatable, limit?: Amount): boolean {
		return !!purchase.buyer && Payment.Creatable.validate(purchase.payment, limit)
	}
}
