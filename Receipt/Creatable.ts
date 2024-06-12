import { isoly } from "isoly"
import { isly } from "isly"
import { Validation as CreatableValidation } from "../Validation"
import { Total } from "./Total"
export interface Creatable {
	total: Total[]
	file: File
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		total: isly.array(Total.type),
		file: isly.fromIs<File>("File", value => value instanceof File),
	})

	export const is = type.is
	export const flaw = type.flaw
	export type Validation = CreatableValidation<Creatable>
	export function validate(receipt: Creatable, currency: isoly.Currency): Validation {
		let result: Return<typeof validate> | undefined
		if (!receipt.total.length)
			result = { status: false, reason: "amount", origin: receipt }
		else
			for (const total of receipt.total) {
				const validated = Total.validate(total, currency)
				if (!validated.status) {
					result = { ...validated, origin: receipt }
					break
				}
			}
		return result ?? { status: true }
	}
}
