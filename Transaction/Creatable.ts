import * as isoly from "isoly"
import { Amount } from "../Amount"

export interface Creatable {
	reference?: string
	purchaseId: string
	descriptor: string
	amount: Amount
	date: {
		transaction: isoly.DateTime
		payment?: isoly.DateTime
	}
	receiptId?: string
	balance: Amount
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(value.reference == undefined || typeof value.reference == "string") &&
			typeof value.descriptor == "string" &&
			typeof value.date == "object" &&
			isoly.DateTime.is(value.date.transaction) &&
			(value.date.payment == undefined || isoly.DateTime.is(value.date.payment)) &&
			(value.receiptId == undefined || typeof value.receiptId == "string") &&
			typeof value.purchaseId == "string" &&
			Amount.is(value.balance)
		)
	}
}
