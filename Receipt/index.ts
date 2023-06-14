import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { CostCenter } from "../CostCenter"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Transaction } from "../Transaction"
import { Creatable as CreatableRequest } from "./Creatable"
import { Total as ReceiptTotal } from "./Total"
export interface Receipt {
	id: cryptly.Identifier
	original: string
	total: ReceiptTotal[]
	date: isoly.DateTime
	transactionId?: string
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			isoly.DateTime.is(value.date) &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Array.isArray(value.total) &&
			value.total.every(ReceiptTotal.is) &&
			(value.transactionId == undefined || typeof value.transactionId == "string")
		)
	}
	export function find<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; delegation: Delegation; purchase: Purchase; found: Receipt } | undefined {
		let result: { root: T; delegation: Delegation; purchase: Purchase; found: Receipt } | undefined
		roots.find(
			root =>
				"purchases" in root &&
				root.purchases.find(purchase =>
					purchase.receipts.find(
						receipt =>
							receipt.id == id &&
							(result = { root, delegation: root as Delegation, purchase: purchase, found: receipt })
					)
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
	export function list<T = Receipt, TRoot extends Delegation | CostCenter = Delegation | CostCenter>(
		roots: Iterable<TRoot>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list<TRoot extends Delegation | CostCenter>(roots: Iterable<TRoot>): Generator<T> {
			for (const root of roots) {
				if ("purchases" in root)
					for (const purchase of root.purchases)
						for (const receipt of purchase.receipts)
							(!filter || filter(receipt, purchase, root)) &&
								(yield map ? map(receipt, purchase, root) : (receipt as T))

				yield* list(root.delegations)
				if ("costCenters" in root)
					yield* list(root.costCenters)
			}
		}
		return Array.from(list(roots))
	}
	export function validate(receipt: Receipt, currency?: isoly.Currency): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			(!receipt.total.length || !currency || receipt.total.every(total => Total.validate(total, currency))) &&
			receipt.transactionId != ""
		)
	}
	export type Link = Transaction.Link
	export const link = Transaction.link
	export type Creatable = CreatableRequest
	export const Creatable = CreatableRequest
	export type Total = ReceiptTotal
	export const Total = ReceiptTotal
}
