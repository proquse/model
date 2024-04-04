import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import { Merchant as TransactionMerchant } from "./Merchant"
import { Operation as TransactionOperation } from "./Operation"
import { Status as TransactionStatus } from "./Status"

export interface Transaction {
	reference: string
	card: { reference: string }
	receipts: string[]
	merchant: Transaction.Merchant
	operations: Transaction.Operation[]
	status: Transaction.Status
	amount: Amount
	created: string
}
export namespace Transaction {
	export import Operation = TransactionOperation
	export import Merchant = TransactionMerchant
	export import Status = TransactionStatus
	export const type = isly.object<Transaction>({
		reference: isly.string(),
		card: isly.object({ reference: isly.string() }),
		receipts: isly.array(isly.string()),
		merchant: Merchant.type,
		operations: isly.array(Operation.type),
		status: Status.type,
		amount: Amount.type,
		created: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw
}
