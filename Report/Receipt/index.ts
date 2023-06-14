import { isly } from "isly"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { PreviewData as ReceiptPreviewData } from "./PreviewData"

export interface Receipt {
	file: File
}

export namespace Receipt {
	export const type = isly.object<Receipt>({
		file: isly.fromIs<File>("File", value => value instanceof File),
	})
	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ReceiptCreatable
	export const Creatable = ReceiptCreatable
	export type PreviewData = ReceiptPreviewData
	export const PreviewData = ReceiptPreviewData
}
