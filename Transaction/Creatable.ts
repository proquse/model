import * as isoly from "isoly"
import { Amount } from "../Amount"

export interface Creatable {
	reference?: string
	purchaseId?: string
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
	export function is(creatable: Creatable | any): creatable is Creatable {
		return (
			typeof creatable == "object" &&
			(creatable.reference == undefined || typeof creatable.reference == "string") &&
			typeof creatable.descriptor == "string" &&
			typeof creatable.date == "object" &&
			isoly.DateTime.is(creatable.date.transaction) &&
			(creatable.date.payment == undefined || isoly.DateTime.is(creatable.date.payment)) &&
			(creatable.receiptId == undefined || typeof creatable.receiptId == "string") &&
			(typeof creatable.purchaseId == "string" || creatable.purchaseId == undefined) &&
			Amount.is(creatable.balance)
		)
	}
}
