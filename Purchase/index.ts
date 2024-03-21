import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { CostCenter } from "../CostCenter"
import { Delegation } from "../Delegation"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Creatable as PurchaseCreatable } from "./Creatable"
import { Identifier as PurchaseIdentifier } from "./Identifier"

export interface Purchase extends Omit<Purchase.Creatable, "payment"> {
	id: Purchase.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	email: userwidgets.Email
	receipts: Receipt[]
	payment: Payment
	type: "purchase"
}

export namespace Purchase {
	export type Identifier = PurchaseIdentifier
	export const Identifier = PurchaseIdentifier
	export const type: isly.object.ExtendableType<Purchase> = PurchaseCreatable.type.extend<Purchase>({
		id: Identifier.type,
		created: isly.fromIs("DateTime", isoly.DateTime.is),
		modified: isly.fromIs("DateTime", isoly.DateTime.is),
		email: userwidgets.Email.type,
		receipts: isly.array(Receipt.type),
		payment: Payment.type,
		type: isly.string("purchase"),
	})

	export const is = type.is
	export const flaw = type.flaw

	export function find(
		roots: (CostCenter | Delegation)[],
		id: string
	): { root: CostCenter | Delegation; parent: Delegation; found: Purchase } | undefined {
		let result: { root: CostCenter | Delegation; parent: Delegation; found: Purchase } | undefined = undefined

		for (const root of roots)
			if (root.type == "delegation") {
				for (const use of root.usage)
					if (use.type == "purchase" && use.id == id) {
						result = { root, parent: root, found: use }
						break
					} else if (use.type == "delegation") {
						result = find([use], id)
						if (result) {
							result = { ...result, root }
							break
						}
					}

				if (result) {
					result = { ...result, root }
					break
				}
			} else {
				result = find(root.usage, id)
				if (result) {
					result = { ...result, root }
					break
				}
			}

		return result
	}

	export function list<T = Purchase>(
		roots: Iterable<Delegation | CostCenter>,
		filter?: (purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list(roots: Iterable<Delegation | CostCenter>): Generator<T, undefined> {
			for (const root of roots)
				if (root.type == "costCenter")
					yield* list(root.usage)
				else
					for (const use of root.usage)
						if (use.type == "delegation")
							yield* list([use])
						else if (!filter || filter(use, root))
							yield map ? map(use, root) : (use as T)
		}
		return Array.from(list(roots))
	}

	export function change(
		roots: (Delegation | CostCenter)[],
		change: Purchase
	): { root: Delegation | CostCenter; parent: Delegation; changed: Purchase } | undefined
	export function change(purchase: Purchase, change: Purchase): Purchase
	export function change(
		roots: (Delegation | CostCenter)[] | Purchase,
		change: Purchase
	): { root: Delegation | CostCenter; parent: Delegation; changed: Purchase } | Purchase | undefined {
		let result: { root: Delegation | CostCenter; parent: Delegation; changed: Purchase } | Purchase | undefined
		if (Purchase.is(roots))
			result = Object.assign(roots, change)
		else {
			const search = find(roots, change.id)
			if (search)
				result = {
					root: search.root,
					parent: search.parent,
					changed: Object.assign(search.found, change),
				}
		}
		return result
	}

	export function remove(
		roots: (Delegation | CostCenter)[],
		id: string
	): { root: Delegation | CostCenter; parent: Delegation; removed: Purchase } | undefined {
		const search = find(roots, id)
		const index = search?.parent.usage.findIndex(purchase => purchase == search.found) ?? -1

		return !search || index < 0
			? undefined
			: search.parent.usage.splice(index, 1) && {
					root: search.root,
					parent: search.parent,
					removed: search.found,
			  }
	}
	export function validate(
		purchase: Purchase,
		options?: { date?: isoly.Date; limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const date = options?.date ?? isoly.Date.now()
		const cadence = Cadence.allocated(purchase.payment.limit, date, { limit: options?.limit })
		return (
			cadence > 0 &&
			(!options?.limit || cadence <= options.limit) &&
			isoly.DateTime.getDate(purchase.created) <= purchase.payment.limit.created &&
			purchase.payment.limit.created <= date &&
			(!options?.currency || purchase.payment.limit.currency == options.currency) &&
			purchase.receipts.every(r => Receipt.validate(r, purchase.payment.limit.currency)) &&
			(!options?.spent || Cadence.allocated(purchase.payment.limit, date, { limit: options.limit }) >= spent(purchase))
		)
	}
	export const spent = Object.assign(calculateSpent, { balance: calculateSpentBalance })
	function calculateSpent(purchase: Purchase, options?: { vat?: boolean }): number {
		return purchase.receipts.reduce(
			(result, receipt) =>
				isoly.Currency.add(
					purchase.payment.limit.currency,
					result,
					Receipt.spent(receipt, purchase.payment.limit.currency, options)
				),
			0
		)
	}
	export function calculateSpentBalance(purchase: Purchase, allocated: number): number
	export function calculateSpentBalance(purchase: Purchase, date: isoly.Date): number
	export function calculateSpentBalance(purchase: Purchase, allocated: isoly.Date | number): number {
		allocated = typeof allocated == "number" ? allocated : Cadence.allocated(purchase.payment.limit, allocated)
		return isoly.Currency.subtract(purchase.payment.limit.currency, allocated, spent(purchase))
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
