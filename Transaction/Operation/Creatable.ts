import { isly } from "isly"
import { Amount } from "../../Amount"
import { Merchant } from "../Merchant"
import { Status } from "./Status"
import { Type } from "./Type"

export interface Creatable {
	type: Type
	reference: string
	amount: Amount
	status: Status
	transaction: { reference: string; card: { reference: string }; receipts?: string[]; merchant: Merchant }
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		type: Type.type,
		reference: isly.string(),
		amount: Amount.type,
		status: Status.type,
		transaction: isly.object({
			reference: isly.string(),
			card: isly.object<Creatable["transaction"]["card"]>({ reference: isly.string() }),
			receipts: isly.array(isly.string()).optional(),
			merchant: Merchant.type,
		}),
	})
	export const is = type.is
	export const flaw = type.flaw
}
