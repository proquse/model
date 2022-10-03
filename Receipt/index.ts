import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
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
