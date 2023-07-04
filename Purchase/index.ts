import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
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
	})

	export const is = type.is
	export const flaw = type.flaw
	export function create(
		purchase: Purchase.Creatable,
		organization: userwidgets.Organization["id"],
		email: userwidgets.Email,
		override?: Partial<Purchase>
	): Purchase {
		const now = isoly.DateTime.now()
		const id = cryptly.Identifier.generate(Identifier.length)
		const [recipient, domain] = email.split("@")
		return {
			...purchase,
			...override,
			id: override?.id ?? id,
			created: override?.created ?? now,
			modified: override?.modified ?? now,
			email: override?.email ?? `${recipient}+${organization}_${id}@${domain}`,
			receipts: override?.receipts ?? [],
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
	export function validate(
		purchase: Purchase,
		date: isoly.Date,
		options?: { limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const cadence = Cadence.allocated(purchase.payment.limit, date)
		return (
			cadence > 0 &&
			(!options?.currency || purchase.payment.limit.currency == options.currency) &&
			(options?.limit == undefined || cadence <= options.limit) &&
			(!options?.spent ||
				(purchase.receipts.every(receipt => Receipt.validate(receipt, purchase.payment.limit.currency)) &&
					purchase.receipts.reduce(
						(result, receipt) =>
							isoly.Currency.add(
								purchase.payment.limit.currency,
								result,
								Receipt.spent(receipt, purchase.payment.limit.currency)
							),
						0
					) <= cadence))
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
	export function calculateSpentBalance(purchase: Purchase, date: isoly.Date): number {
		return isoly.Currency.subtract(
			purchase.payment.limit.currency,
			Cadence.allocated(purchase.payment.limit, date),
			spent(purchase)
		)
	}
	export type Creatable = PurchaseCreatable
	export const Creatable = PurchaseCreatable
}
