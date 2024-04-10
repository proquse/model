import { isoly } from "isoly"
import { isly } from "isly"
import { Creatable as TransactionCreatable } from "./Creatable"
import { Merchant as TransactionMerchant } from "./Merchant"
import { Operation as TransactionOperation } from "./Operation"
import { Status as TransactionStatus } from "./Status"

export interface Transaction extends Transaction.Creatable {
	modified: isoly.DateTime
	created: isoly.DateTime
}
export namespace Transaction {
	export import Operation = TransactionOperation
	export import Merchant = TransactionMerchant
	export import Status = TransactionStatus
	export import Creatable = TransactionCreatable
	export const type = Creatable.type.extend<Transaction>({
		modified: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
		created: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw

	export const from = {
		operation: (operation: Operation.Creatable): Transaction => {
			const now = isoly.DateTime.now()
			const time = {
				created: now,
				modified: now,
			}
			return {
				...time,
				reference: operation.transaction.reference,
				amount: operation.amount,
				card: operation.transaction.card,
				merchant: operation.transaction.merchant,
				operations: [(({ transaction, ...operation }) => ({ ...time, ...operation }))(operation)],
				receipts: operation.transaction.receipts ?? [],
				status: operation.status == "failed" ? "failed" : operation.type == "authorize" ? "reserved" : "finalized",
			}
		},
	}
}
