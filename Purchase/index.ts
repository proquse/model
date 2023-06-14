import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { Amount } from "../Amount"
import { CostCenter } from "../CostCenter"
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
	buyer: string //email
	amount?: Amount
	email: string
	receipts: Receipt[]
	transactions: Transaction[]
}

export namespace Purchase {
	export function is(value: Purchase | any): value is Purchase & Record<string, any> {
		return (
			typeof value == "object" &&
			value &&
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
		payment: Payment,
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
			payment: payment,
			email: `${recipient}+${organizationId}_${id}@${domain}`,
			receipts: [],
			transactions: [],
		}
	}
	export function find<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; parent: Delegation; found: Purchase } | undefined {
		let result: { root: T; parent: Delegation; found: Purchase } | undefined
		roots.find(
			root =>
				"purchases" in root &&
				root.purchases.find(
					purchase => purchase.id == id && (result = { root, parent: root as Delegation, found: purchase })
				)
		) ??
			roots.find(
				root =>
					(result = (result => (!result ? result : { ...result, root }))(find(root.delegations, id))) ??
					("costCenters" in root &&
						(result = (result => (!result ? result : { ...result, root }))(find(root.costCenters, id))))
			)
		return result
	}
	export function list<T = Purchase, TRoot extends Delegation | CostCenter = Delegation | CostCenter>(
		roots: Iterable<TRoot>,
		filter?: (purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list<TRoot extends Delegation | CostCenter>(roots: Iterable<TRoot>): Generator<T> {
			for (const root of roots) {
				if ("purchases" in root)
					for (const purchase of root.purchases)
						(!filter || filter(purchase, root)) && (yield map ? map(purchase, root) : (purchase as T))
				yield* list(root.delegations)
				if ("costCenters" in root)
					yield* list(root.costCenters)
			}
		}
		return Array.from(list(roots))
	}
	export function change<T extends Delegation | CostCenter>(
		roots: T[],
		change: Purchase
	): { root: T; parent: Delegation; changed: Purchase } | undefined
	export function change(purchase: Purchase, change: Purchase): Purchase
	export function change<T extends Delegation | CostCenter>(
		roots: T[] | Purchase,
		change: Purchase
	): { root: T; parent: Delegation; changed: Purchase } | Purchase | undefined {
		let result: { root: T; parent: Delegation; changed: Purchase } | Purchase | undefined
		if (!Array.isArray(roots))
			result = Object.assign(roots, change)
		else {
			const search = find(roots, change.id)
			if (search)
				result = { root: search.root, parent: search.parent, changed: Object.assign(search.found, change) }
		}
		return result
	}
	export function remove<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; parent: Delegation; removed: Purchase } | undefined {
		// let result: { root: T; parent: Delegation; removed: Purchase } | undefined
		const search = find(roots, id)
		const index = search?.parent.purchases.findIndex(purchase => purchase == search.found) ?? -1

		return !search || index < 0
			? undefined
			: search.parent.purchases.splice(index, 1) && {
					root: search.root,
					parent: search.parent,
					removed: search.found,
			  }
		// roots.find(root =>
		// 	root.purchases.find(
		// 		(purchase, index) => purchase.id == id && (result = { root: root, removed: root.purchases.splice(index, 1)[0] })
		// 	)
		// )
		// return result ?? (roots.find(root => (result = remove(root.delegations, id))) && result)
	}
	export function validate(purchase: Purchase, limit?: Amount): boolean {
		return (
			!!purchase.id &&
			!!purchase.buyer &&
			purchase.created <= purchase.modified &&
			purchase.modified <= isoly.DateTime.now() &&
			Payment.validate(purchase.payment, limit) &&
			(!purchase.amount || Amount.validate(purchase.amount, purchase.payment.limit)) &&
			!!purchase.email &&
			purchase.receipts.every(receipt => Receipt.validate(receipt)) &&
			(limit == undefined ||
				purchase.receipts.reduce(
					(total, receipt) => total + receipt.total.reduce((total, { net: [net], vat: [vat] }) => total + net + vat, 0),
					0
				) <= limit[0]) &&
			purchase.transactions.every(transaction => Transaction.validate(transaction))
		)
	}
	export function spent(purchase: Purchase): Amount {
		return (purchase.amount = [
			purchase.transactions.reduce((aggregate, current) => aggregate + current.amount[0], 0) * -1,
			purchase.amount?.[1] ?? purchase.payment.limit[1],
		])
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
