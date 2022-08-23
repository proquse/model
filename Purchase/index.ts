import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
import type { Delegation } from "../Delegation"
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
	export function find(root: Delegation, purchaseId: string): Purchase | undefined {
		let result: Purchase | undefined = root.purchases.find(purchase => purchase.id == purchaseId)
		return result ?? root.delegations.find(delegation => (result = find(delegation, purchaseId))) ? result : undefined
	}
	export function change(root: Delegation, updated: Purchase): Purchase | undefined
	export function change(old: Purchase, updated: Purchase): Purchase | undefined
	export function change(root: Delegation | Purchase, updated: Purchase): Purchase | undefined {
		const result = Purchase.is(root) ? root : find(root, updated.id)
		if (result) {
			Object.keys(result).forEach((key: keyof Purchase) => delete result[key])
			Object.assign(result, updated)
		}
		return result
	}
	export function remove(root: Delegation, purchaseId: string): Purchase | undefined {
		let result: Purchase | undefined = undefined
		const index = root.purchases.findIndex(purchase => purchase.id == purchaseId)
		return index >= 0
			? (result = root.purchases.splice(index, 1).at(0))
			: root.delegations.find(delegation => (result = remove(delegation, purchaseId)))
			? result
			: undefined
	}
	export function validate(value: Purchase, limit?: Amount) {
		return (
			!!value.id &&
			!!value.purpose &&
			!!value.buyer &&
			value.created <= value.modified &&
			Payment.validate(value.payment, limit) &&
			(!value.amount || Amount.validate(value.amount)) &&
			(!value.receipt ||
				(Receipt.is(value.receipt) && Receipt.validate(value.receipt)) ||
				!!(value.receipt as { to?: string }).to)
		)
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
