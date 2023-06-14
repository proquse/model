import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Transaction } from "../Transaction"
import { Creatable as PurchaseCreatable } from "./Creatable"

export interface Purchase extends PurchaseCreatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	amount?: Amount
	email: string
	receipts: Receipt[]
	transactions: Transaction[]
}

export namespace Purchase {
	export const type: isly.object.ExtendableType<Purchase> = PurchaseCreatable.type.extend<Purchase>({
		id: isly.fromIs("Id", cryptly.Identifier.is),
		created: isly.fromIs("DateTime", isoly.DateTime.is),
		modified: isly.fromIs("DateTime", isoly.DateTime.is),
		amount: Amount.type.optional(),
		email: isly.string(),
		receipts: isly.array(Receipt.type),
		transactions: isly.array(Transaction.type),
	})

	export const is = type.is
	export const flaw = type.flaw
	export function create(
		purchase: Purchase.Creatable,
		organizationId: string,
		email: string,
		override?: Partial<Purchase>,
		idLength: cryptly.Identifier.Length = 8
	): Purchase {
		const now = isoly.DateTime.now()
		const id = cryptly.Identifier.generate(idLength)
		const [recipient, domain] = email.split("@")
		return {
			...purchase,
			...override,
			id: override?.id ?? id,
			created: override?.created ?? now,
			modified: override?.modified ?? now,
			email: override?.email ?? `${recipient}+${organizationId}_${id}@${domain}`,
			receipts: override?.receipts ?? [],
			transactions: override?.transactions ?? [],
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
		const search = find(roots, id)
		const index = search?.parent.purchases.findIndex(purchase => purchase == search.found) ?? -1

		return !search || index < 0
			? undefined
			: search.parent.purchases.splice(index, 1) && {
					root: search.root,
					parent: search.parent,
					removed: search.found,
			  }
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
