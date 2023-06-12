import { isoly } from "isoly"
import { Total } from "./Total"
export interface Creatable {
	total: Total[]
	file: File
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			value &&
			Array.isArray(value.total) &&
			value.total.every(Total.is) &&
			value.file instanceof File
		)
	}
	export function validate(receipt: Creatable, currency: isoly.Currency): boolean {
		return !!(
			receipt.total.length &&
			receipt.total.every(total => Total.validate(total, currency)) &&
			receipt.file instanceof File
		)
	}
}
