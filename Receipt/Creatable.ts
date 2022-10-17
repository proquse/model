import { Amount } from "../Amount"

export interface Creatable {
	amount: Amount
	vat: number
	file: Uint8Array | ArrayBuffer
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number" &&
			(value.file instanceof ArrayBuffer || ArrayBuffer.isView(value.file))
		)
	}
}
