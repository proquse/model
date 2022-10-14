import * as isoly from "isoly"
import { Amount } from "../Amount"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Creatable as TransactionCreatable } from "./Creatable"
import { Link as TransactionLink } from "./Link"

export interface Transaction {
	id: string
	reference: string
	descriptor: string
	amount: Amount
	date: {
		transaction: isoly.DateTime
		payment?: isoly.DateTime
	}
	receipt?: string
	balance: Amount
}

export namespace Transaction {
	export function is(value: Transaction | any): value is Transaction {
		return (
			typeof value == "object" &&
			typeof value.reference == "string" &&
			typeof value.descriptor == "string" &&
			Amount.is(value.amount) &&
			typeof value.date == "object" &&
			(value.date.transaction == undefined || isoly.DateTime.is(value.date.transaction)) &&
			(value.date.payment == undefined || isoly.DateTime.is(value.date.payment)) &&
			(value.receipt == undefined || typeof value.receipt == "string") &&
			Amount.is(value.balance)
		)
	}
	export function create(transaction: Creatable, id: string, balance: Amount): Transaction {
		return { ...transaction, id: id, balance: balance, reference: transaction.reference ?? id }
	}
	function findInner<T, S>(elements: T[], finder: (element: T) => S | undefined): S | undefined {
		let result: S | undefined
		elements.find(single => (result = finder(single)))
		return result
	}
	export function find(
		roots: Delegation[],
		id: string
	): { root: Delegation; purchase: Purchase; found: Transaction } | undefined {
		return findInner(roots, root => {
			let result = findInner(root.purchases, purchase =>
				findInner(purchase.transactions, transaction =>
					transaction.id != id ? undefined : { root: root, purchase: purchase, found: transaction }
				)
			)
			return result ?? ((result = find(root.delegations, id)) && { ...result, root: root })
		})
	}
	export function list(
		roots: Iterable<Delegation>,
		filter?: (transaction: Transaction, purchase: Purchase, delegation: Delegation) => any
	): Transaction[] {
		function* list(
			roots: Iterable<Delegation>,
			filter?: (transaction: Transaction, purchase: Purchase, delegation: Delegation) => any
		): Generator<Transaction> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					for (const transaction of purchase.transactions) {
						;(!filter || filter(transaction, purchase, root)) && (yield transaction)
					}
				}
				yield* list(root.delegations, filter)
			}
		}
		return Array.from(list(roots, filter))
	}
	export function validate(transaction: Transaction): boolean {
		return (
			!!transaction.id &&
			!!transaction.reference &&
			!!transaction.descriptor &&
			(!(transaction.date.payment && transaction.date.transaction) ||
				transaction.date.payment <= transaction.date.transaction) &&
			transaction.receipt != ""
		)
	}
	export function link(links: TransactionLink[], purchase: Purchase): TransactionLink[] {
		return links.filter(link => {
			let result = true
			const transaction = purchase.transactions.find(transaction => transaction.id == link.transactionId)
			if (transaction) {
				const receipt = purchase.receipts.find(receipt => receipt.id == link.receiptId)
				receipt && ((transaction.receipt = receipt.id), (receipt.transaction = transaction.id), (result = false))
			}
			return result
		})
	}
	export const Link = TransactionLink
	export type Link = TransactionLink
	export const Creatable = TransactionCreatable
	export type Creatable = TransactionCreatable
}
