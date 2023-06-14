import { isly } from "isly"
import { Creatable as ReceiptCreatable } from "./Creatable"

export interface Receipt {
	file: File
}

export namespace Receipt {
	export const type = isly.object<Receipt>({
		file: isly.fromIs<File>("File", value => value instanceof File),
	})
	export type Creatable = ReceiptCreatable
	export const Creatable = ReceiptCreatable
}
