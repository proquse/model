import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Creatable as PurchaseCreatable } from "./Creatable"

export interface Purchase extends PurchaseCreatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	payment: Payment
	amount?: Amount
	receipt?: Receipt | { to: string }
}

export namespace Purchase {
	export function is(value: Purchase | any): value is Purchase & Record<string, any> {
		return (
			PurchaseCreatable.is(value) &&
			cryptly.Identifier.is(value.id) &&
			isoly.DateTime.is(value.created) &&
			isoly.DateTime.is(value.modified) &&
			Payment.is(value.payment) &&
			(typeof value.amount == "undefined" || Amount.is(value.amount)) &&
			(Receipt.is(value.receipt) ||
				(typeof value.receipt == "object" && typeof value.receipt.to == "string") ||
				typeof value.receipt == "undefined")
		)
	}
	export function create(
		purchase: Purchase.Creatable,
		card: string,
		idLength: cryptly.Identifier.Length = 8
	): Purchase {
		const now = isoly.DateTime.now()
		return {
			id: cryptly.Identifier.generate(idLength),
			created: now,
			modified: now,
			...purchase,
			payment: Payment.create(purchase.payment, card),
		}
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
