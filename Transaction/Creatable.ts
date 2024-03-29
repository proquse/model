import { isoly } from "isoly"
import { isly } from "isly"
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
	export const type = isly.object<Creatable>({
		reference: isly.string().optional(),
		purchaseId: isly.string().optional(),
		descriptor: isly.string(),
		amount: Amount.type,
		date: isly.object({
			transaction: isly.fromIs("DateTime", isoly.DateTime.is),
			payment: isly.fromIs("DateTime", isoly.DateTime.is).optional(),
		}),
		receiptId: isly.string().optional(),
		balance: Amount.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
