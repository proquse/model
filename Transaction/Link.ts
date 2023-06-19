import { isly } from "isly"

export interface Link {
	transactionId: string
	receiptId: string
}

export namespace Link {
	export const type = isly.object<Link>({ transactionId: isly.string(), receiptId: isly.string() })
	export const is = type.is
	export const flaw = type.flaw
}
