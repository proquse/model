import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Transaction } from "../Transaction"

export interface Receipt {
	id: cryptly.Identifier
	original: string
	amount: Amount
	date: isoly.DateTime
	vat: number
	transaction?: string
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			isoly.DateTime.is(value.date) &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number"
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
	export function list(
		roots: Iterable<Delegation>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any
	) {
		function* list(
			roots: Iterable<Delegation>,
			filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any
		): Generator<Receipt> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					for (const receipt of purchase.receipts) {
						;(!filter || filter(receipt, purchase, root)) && (yield receipt)
					}
				}
				yield* list(root.delegations, filter)
			}
		}
		return Array.from(list(roots, filter))
	}
	export function validate(receipt: Receipt, limit?: Amount): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			Amount.validate(receipt.amount, limit) &&
			receipt.amount[0] > 0 &&
			receipt.vat >= 0 &&
			receipt.vat <= 1
		)
	}
	export const link = Transaction.link
	export type Link = Transaction.Link
}
