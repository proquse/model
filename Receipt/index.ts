import * as cryptly from "cryptly"
import * as isoly from "isoly"
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
	function findInner<T, S>(elements: T[], finder: (element: T) => S | undefined): S | undefined {
		let result: S | undefined
		elements.find(single => (result = finder(single)))
		return result
	}
	export function find(
		roots: Delegation[],
		id: string
	): { root: Delegation; purchase: Purchase; found: Receipt } | undefined {
		return findInner(roots, root => {
			let result = findInner(root.purchases, purchase =>
				findInner(purchase.receipts, receipt =>
					receipt.id != id ? undefined : { root: root, purchase: purchase, found: receipt }
				)
			)
			return result ?? ((result = find(root.delegations, id)) && { ...result, root: root })
		})
	}
	export function list<T = Receipt>(
		roots: Iterable<Delegation>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list(roots: Iterable<Delegation>): Generator<T> {
			for (const root of roots) {
				for (const purchase of root.purchases)
					for (const receipt of purchase.receipts)
						(!filter || filter(receipt, purchase, root)) && (yield map ? map(receipt, purchase, root) : (receipt as T))

				yield* list(root.delegations)
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
