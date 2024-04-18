import { isly } from "isly"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Preview as ReceiptPreview } from "./Preview"

export interface Receipt {
	file: File
}

export namespace Receipt {
	export import Creatable = ReceiptCreatable
	export import Preview = ReceiptPreview
	export const type = isly.object<Receipt>({
		file: isly.fromIs<File>("File", value => value instanceof File),
	})
	export const is = type.is
	export const flaw = type.flaw
}
