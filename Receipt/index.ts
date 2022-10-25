import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Transaction } from "../Transaction"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Request as ReceiptRequest } from "./Request"

export interface Receipt {
	id: cryptly.Identifier
	original: string
	amount: Amount
	date: isoly.DateTime
	vat: number
	transactionId?: string
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			isoly.DateTime.is(value.date) &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number" &&
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
	export function list<T extends Receipt>(
		roots: Iterable<Delegation>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list(roots: Iterable<Delegation>): Generator<T> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					for (const receipt of purchase.receipts) {
						;(!filter || filter(receipt, purchase, root)) && (yield map ? map(receipt, purchase, root) : (receipt as T))
					}
				}
				yield* list(root.delegations)
			}
		}
		return Array.from(list(roots))
	}
	export function validate(receipt: Receipt, limit?: Amount): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			Amount.validate(receipt.amount, limit) &&
			receipt.amount[0] > 0 &&
			receipt.vat >= 0 &&
			receipt.vat <= 1 &&
			receipt.transactionId != ""
		)
	}
	export const link = Transaction.link
	export type Link = Transaction.Link
	export const Creatable = ReceiptCreatable
	export type Creatable = ReceiptCreatable
	export const Request = ReceiptRequest
	export type Request = ReceiptRequest
}
