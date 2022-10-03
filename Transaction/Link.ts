export interface Link {
	transactionId: string
	receiptId: string
}

export namespace Link {
	export function is(value: Link | any): value is Link {
		return typeof value == "object" && typeof value.transactionId == "string" && typeof value.receiptId == "string"
	}
}
