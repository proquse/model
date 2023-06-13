import { isoly } from "isoly"
import { isly } from "isly"
import { Total } from "./Total"
export interface Creatable {
	total: Total[]
	file: File & { type: "image/jpeg" | "application/pdf" }
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		total: isly.array(Total.type),
		file: isly.fromIs<File & { type: "image/jpeg" | "application/pdf" }>(
			"File",
			value => value instanceof File && (value.type == "image/jpeg" || value.type == "application/pdf")
		),
	})

	export const is = type.is
	export const flaw = type.flaw

	export function validate(receipt: Creatable, currency: isoly.Currency): boolean {
		return !!(
			receipt.total.length &&
			receipt.total.every(total => Total.validate(total, currency)) &&
			receipt.file instanceof File
		)
	}
}
