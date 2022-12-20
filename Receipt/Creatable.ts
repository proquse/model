import * as isoly from "isoly"
import { Total } from "./Total"
export interface Creatable {
	total: Total[]
	file: Uint8Array
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			value &&
			Array.isArray(value.total) &&
			value.total.every(Total.is) &&
			value.file instanceof Uint8Array
		)
	}
	export function validate(receipt: Creatable, currency: isoly.Currency): boolean {
		return !!(
			receipt.total.length &&
			receipt.total.every(total => Total.validate(total, currency)) &&
			receipt.file instanceof Uint8Array
		)
	}
	export function formData(receipt: Creatable & { file: ArrayBuffer | Uint8Array | Blob | File }): FormData {
		const form = new FormData()
		form.append("data", JSON.stringify((({ file, ...data }) => data)(receipt)))
		form.append("file", receipt.file instanceof Blob ? receipt.file : new Blob([receipt.file]))
		return form
	}
	export function parse(form: { data: string; file: { data: Uint8Array } } | any): Creatable | undefined {
		let r: Creatable | undefined
		if (typeof form != "object" || !form || typeof form.data != "string" || typeof form.file != "object" || !form.file)
			r = undefined
		else {
			const parsed = JSON.parse(form.data)
			r = typeof parsed != "object" || !parsed ? undefined : Object.assign(parsed, { file: form.file.data })
		}
		return !is(r) ? undefined : r
	}
}
