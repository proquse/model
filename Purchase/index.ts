import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
import type { Delegation } from "../Delegation"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Transaction } from "../Transaction"
import { Creatable as PurchaseCreatable } from "./Creatable"

export interface Purchase {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	payment: Payment
	purpose: string
	buyer: string
	amount?: Amount
	email: string
	receipts: Receipt[]
	transactions: Transaction[]
}

export namespace Purchase {
	export function is(value: Purchase | any): value is Purchase & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.purpose == "string" &&
			typeof value.buyer == "string" &&
			cryptly.Identifier.is(value.id) &&
			isoly.DateTime.is(value.created) &&
			isoly.DateTime.is(value.modified) &&
			Payment.is(value.payment) &&
			(typeof value.amount == "undefined" || Amount.is(value.amount)) &&
			typeof value.email == "string" &&
			Array.isArray(value.receipts) &&
			value.receipts.every((receipt: unknown) => Receipt.is(receipt)) &&
			Array.isArray(value.transactions) &&
			value.transactions.every((transaction: unknown) => Transaction.is(transaction))
		)
	}
	export function create(
		purchase: Purchase.Creatable,
		token: string,
		organizationId: string,
		to: string,
		idLength: cryptly.Identifier.Length = 8
	): Purchase {
		const now = isoly.DateTime.now()
		const id = cryptly.Identifier.generate(idLength)
		const [recipient, domain] = to.split("@")
		return {
			id: id,
			created: now,
			modified: now,
			...purchase,
			payment: Payment.create(purchase.payment, token),
			email: `${recipient}+${organizationId}|${id}@${domain}`,
			receipts: [],
			transactions: [],
		}
	}
	export function find(roots: Delegation[], id: string): { root: Delegation; found: Purchase } | undefined {
		let result: { root: Delegation; found: Purchase } | undefined
		roots.find(root => root.purchases.find(purchase => purchase.id == id && (result = { root: root, found: purchase })))
		return result ?? (roots.find(root => (result = find(root.delegations, id)) && (result.root = root)) && result)
	}
	export function list(
		roots: Iterable<Delegation>,
		filter?: (purchase: Purchase, parentDelegation: Delegation) => boolean | any
	): Purchase[] {
		function* list(
			roots: Iterable<Delegation>,
			filter?: (purchase: Purchase, parentDelegation: Delegation) => boolean | any
		): Generator<Purchase> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					;(!filter || filter(purchase, root)) && (yield purchase)
				}
				yield* list(root.delegations, filter)
			}
		}
		return Array.from(list(roots, filter))
	}
	export function change(roots: Delegation[], updated: Purchase): { root: Delegation; changed: Purchase } | undefined
	export function change(old: Purchase, updated: Purchase): Purchase
	export function change(
		roots: Delegation[] | Purchase,
		updated: Purchase
	): { root: Delegation; changed: Purchase } | Purchase | undefined {
		let result: { root: Delegation; changed: Purchase } | Purchase | undefined
		if (Array.isArray(roots)) {
			const search = find(roots, updated.id)
			search &&
				(result = { root: search.root, changed: { ...search.found } }) &&
				(Object.keys(search.found).forEach((key: keyof Purchase) => delete search.found[key]),
				Object.assign(search.found, updated))
		} else {
			result = { ...roots }
			Object.keys(roots).forEach((key: keyof Purchase) => delete roots[key])
			Object.assign(roots, updated)
		}
		return result
	}
	export function remove(roots: Delegation[], id: string): { root: Delegation; removed: Purchase } | undefined {
		let result: { root: Delegation; removed: Purchase } | undefined
		roots.find(root =>
			root.purchases.find(
				(purchase, index) => purchase.id == id && (result = { root: root, removed: root.purchases.splice(index, 1)[0] })
			)
		)
		return result ?? (roots.find(root => (result = remove(root.delegations, id))) && result)
	}
	export function validate(purchase: Purchase, limit?: Amount): boolean {
		return (
			!!purchase.id &&
			!!purchase.purpose &&
			!!purchase.buyer &&
			purchase.created <= purchase.modified &&
			purchase.modified <= isoly.DateTime.now() &&
			Payment.validate(purchase.payment, limit) &&
			(!purchase.amount || Amount.validate(purchase.amount, purchase.payment.limit)) &&
			!!purchase.email &&
			purchase.receipts.every(receipt => Receipt.validate(receipt)) &&
			purchase.transactions.every(transaction => Transaction.validate(transaction))
		)
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
