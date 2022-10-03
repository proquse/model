import * as isoly from "isoly"
import { Amount } from "../Amount"
import { Purchase } from "../Purchase"
import { Link as TransactionLink } from "./Link"

export interface Transaction {
	id: string
	reference: string
	descriptor: string
	amount: Amount
	date: {
		transaction?: isoly.DateTime
		payment?: isoly.DateTime
	}
	receipt?: string
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
			(value.receipt == undefined || typeof value.receipt == "string")
		)
	}
	export function validate(transaction: Transaction): boolean {
		return (
			!!transaction.id &&
			!!transaction.reference &&
			!!transaction.descriptor &&
			(transaction.date.payment && transaction.date.transaction
				? transaction.date.payment <= transaction.date.transaction
				: true) &&
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
}
