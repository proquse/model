import { isly } from "isly"
import { Amount } from "../Amount"
import { Merchant } from "./Merchant"
import { Operation } from "./Operation"
import { Status } from "./Status"

export interface Creatable {
	reference: string
	card: { reference: string }
	receipts: string[]
	merchant: Merchant
	operations: Operation[]
	status: Status
	amount: Amount
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		reference: isly.string(),
		card: isly.object({ reference: isly.string() }),
		receipts: isly.array(isly.string()),
		merchant: Merchant.type,
		operations: isly.array(Operation.type),
		status: Status.type,
		amount: Amount.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
