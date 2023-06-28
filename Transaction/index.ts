import { isly } from "isly"
// import { Delegation } from "../Delegation"
// import { Purchase } from "../Purchase"
import { Creatable as TransactionCreatable } from "./Creatable"
import { Link as TransactionLink } from "./Link"

export interface Transaction extends Transaction.Creatable {
	id: string
	reference: string
}

export namespace Transaction {
	export const type: isly.object.ExtendableType<Transaction> = TransactionCreatable.type.extend<Transaction>({
		id: isly.string(),
		reference: isly.string(),
	})
	export const is = type.is
	export const flaw = type.flaw

	export function create(transaction: Creatable, id: string): Transaction {
		return {
			id: id,
			balance: transaction.balance,
			reference: transaction.reference ?? id,
			purchaseId: transaction.purchaseId,
			descriptor: transaction.descriptor,
			amount: transaction.amount,
			date: transaction.date,
			receiptId: transaction.receiptId,
		}
	}
	// function findInner<T, S>(elements: T[], finder: (element: T) => S | undefined): S | undefined {
	// 	let result: S | undefined
	// 	elements.find(single => (result = finder(single)))
	// 	return result
	// }
	// export function find(
	// 	roots: Delegation[],
	// 	id: string
	// ): { root: Delegation; purchase: Purchase; found: Transaction } | undefined {
	// 	return findInner(roots, root => {
	// 		let result = findInner(root.purchases, purchase =>
	// 			findInner(purchase.transactions, transaction =>
	// 				transaction.id != id ? undefined : { root: root, purchase: purchase, found: transaction }
	// 			)
	// 		)
	// 		return result ?? ((result = find(root.delegations, id)) && { ...result, root: root })
	// 	})
	// }
	// export function list<T = Transaction>(
	// 	roots: Iterable<Delegation>,
	// 	filter?: (transaction: Transaction, purchase: Purchase, delegation: Delegation) => any,
	// 	map?: (transaction: Transaction, purchase: Purchase, delegation: Delegation) => T
	// ): T[] {
	// 	function* list(roots: Iterable<Delegation>): Generator<T> {
	// 		for (const root of roots) {
	// 			for (const purchase of root.purchases)
	// 				for (const transaction of purchase.transactions)
	// 					(!filter || filter(transaction, purchase, root)) &&
	// 						(yield map ? map(transaction, purchase, root) : (transaction as T))

	// 			yield* list(root.delegations)
	// 		}
	// 	}
	// 	return Array.from(list(roots))
	// }
	export function validate(transaction: Transaction): boolean {
		return (
			!!transaction.id &&
			!!transaction.reference &&
			!!transaction.descriptor &&
			(!(transaction.date.payment && transaction.date.transaction) ||
				transaction.date.payment <= transaction.date.transaction) &&
			transaction.receiptId != ""
		)
	}
	// export function link(links: TransactionLink[], purchase: Purchase): TransactionLink[] {
	// 	return links.filter(link => {
	// 		let result = true
	// 		const transaction = purchase.transactions.find(transaction => transaction.id == link.transactionId)
	// 		if (transaction) {
	// 			const receipt = purchase.receipts.find(receipt => receipt.id == link.receiptId)
	// 			receipt && ((transaction.receiptId = receipt.id), (receipt.transactionId = transaction.id), (result = false))
	// 		}
	// 		return result
	// 	})
	// }
	export const Link = TransactionLink
	export type Link = TransactionLink
	export const Creatable = TransactionCreatable
	export type Creatable = TransactionCreatable
}
