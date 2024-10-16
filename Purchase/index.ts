import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Amount } from "../Amount"
import { Cadence } from "../Cadence"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Transaction } from "../Transaction"
import { Validation as PurchaseValidation } from "../Validation"
import { Warning } from "../Warning"
import { Creatable as PurchaseCreatable } from "./Creatable"
import { Identifier as PurchaseIdentifier } from "./Identifier"
import { Link as PurchaseLink } from "./link"

export interface Purchase extends Omit<Purchase.Creatable, "payment"> {
	type: "purchase"
	id: Purchase.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	email: userwidgets.Email
	receipts: Receipt[]
	payment: Payment
	transactions: Transaction[]
}

export namespace Purchase {
	export import Identifier = PurchaseIdentifier
	export import Creatable = PurchaseCreatable
	export import Link = PurchaseLink
	export type Validation = PurchaseValidation<Delegation | Purchase | Receipt>
	export const type = PurchaseCreatable.type.extend<Purchase>({
		type: isly.string("purchase"),
		id: Identifier.type,
		created: isly.fromIs("DateTime", isoly.DateTime.is),
		modified: isly.fromIs("DateTime", isoly.DateTime.is),
		email: userwidgets.Email.type,
		receipts: isly.array(Receipt.type),
		payment: Payment.type,
		transactions: isly.array(Transaction.type),
	})
	export const is = type.is
	export const flaw = type.flaw

	export function find<T extends CostCenter | Delegation>(
		roots: T[],
		criteria: string | ((purchase: Purchase) => boolean)
	): { root: T; parent: Delegation; found: Purchase } | undefined {
		let result: { root: T; parent: Delegation; found: Purchase } | undefined
		for (const root of roots)
			if (root.type == "delegation") {
				for (const use of root.usage)
					if (use.type == "purchase" && (typeof criteria == "string" ? use.id == criteria : criteria(use))) {
						result = { root, parent: root, found: use }
						break
					} else if (use.type == "delegation") {
						result = find([use], criteria) as any
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
				result = find(root.usage, criteria) as any
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
		roots: CostCenter[],
		change: Purchase
	): { root: CostCenter; parent: Delegation; changed: Purchase } | undefined
	export function change(
		roots: Delegation[],
		change: Purchase
	): { root: Delegation; parent: Delegation; changed: Purchase } | undefined
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
			const search = find<CostCenter | Delegation>(roots as any, change.id)
			if (!search)
				result = undefined as any
			else
				result = {
					root: search.root,
					parent: search.parent,
					changed: Object.assign(search.found, change),
				}
		}
		return result
	}

	export function remove<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; parent: Delegation; removed: Purchase } | undefined {
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
	// TODO: currently not validating transactions. Should we do that?
	export function validate(
		purchase: Purchase,
		options?: { date?: isoly.Date; limit?: number; spent?: boolean; parent?: Delegation }
	): Validation {
		let result: Return<typeof validate> | undefined
		const date = options?.date ?? isoly.Date.now()
		const limit = Payment.exchange(
			purchase.payment,
			options?.parent?.amount.currency ?? purchase.payment.limit.currency
		)
		const allocated = !limit ? undefined : Cadence.allocated(limit, date, { limit: options?.limit })

		if (limit == undefined || allocated == undefined)
			result = { status: false, reason: "exchange", origin: purchase }
		else if (allocated <= 0)
			result = { status: false, reason: "overallocated", origin: options?.parent ?? purchase }
		else if (isoly.DateTime.getDate(purchase.created) > purchase.payment.limit.created)
			result = { status: false, reason: "time", origin: purchase }
		else if (options?.spent && allocated < spent(purchase))
			result = { status: false, reason: "overspent", origin: purchase }
		else {
			for (const receipt of purchase.receipts) {
				const validated = Receipt.validate(receipt, purchase.payment.limit.currency)
				if (!validated.status) {
					result = validated
					break
				}
			}
		}
		return result ?? { status: true }
	}
	export const spent = Object.assign(calculateSpent, { balance: calculateSpentBalance })
	function calculateSpent(purchase: Purchase, options?: { vat?: boolean }): number {
		return purchase.transactions.length
			? purchase.transactions.reduce<number>(
					(result, transaction) =>
						isoly.Currency.add(purchase.payment.limit.currency, result, transaction.amount.value),
					0
			  )
			: purchase.receipts.reduce(
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
	export function calculateSpentBalance(purchase: Purchase, date: isoly.Date, currency: isoly.Currency): number
	export function calculateSpentBalance(
		purchase: Purchase,
		allocated: isoly.Date | number,
		currency?: isoly.Currency
	): number {
		allocated =
			typeof allocated == "number"
				? allocated
				: Cadence.allocated(
						(!currency ? purchase.payment.limit : Payment.exchange(purchase.payment, currency)) ??
							purchase.payment.limit,
						allocated
				  )
		return isoly.Currency.subtract(purchase.payment.limit.currency, allocated, spent(purchase))
	}
	export function warnings(
		purchase: Purchase,
		date: isoly.Date,
		budget: Amount,
		onWarning?: (warning: Warning) => void
	): Warning.Record {
		const warnings: Return<typeof Purchase.warnings>[string] = { value: [], child: [] }
		const allocated = Cadence.allocated(
			Payment.exchange(purchase.payment, budget.currency) ?? purchase.payment.limit,
			date,
			{ limit: budget.value }
		)

		// TODO: exchange back to budget currency
		const spent = Purchase.spent(purchase)
		if (spent > allocated)
			warnings.value.push({
				source: purchase.id,
				type: "overspent",
				severity: 0,
				message: `Overspent by ${spent - allocated}`,
			})
		if (purchase.payment.type == "card") {
			const transactions = purchase.transactions.filter(transaction =>
				purchase.receipts.find(receipt => transaction.receipts.includes(receipt.id))
			)
			if (transactions.length)
				warnings.value.push({
					source: purchase.id,
					type: "missing-receipt",
					severity: 0,
					message: `Missing ${transactions.length} receipts.`,
				})
		} else if (!purchase.receipts.length)
			warnings.value.push({
				source: purchase.id,
				type: "missing-receipt",
				severity: 0,
				message: `Missing at least one receipt.`,
			})

		if (onWarning)
			warnings.value.forEach(warning => onWarning(warning))
		return { [purchase.id]: warnings }
	}
}
