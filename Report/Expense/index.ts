import { isly } from "isly"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { PreviewData as ExpensePreviewData } from "./PreviewData"
export interface Expense {
	file: File
}

export namespace Expense {
	export const type = isly.object<Expense>({
		file: isly.fromIs<File>("File", value => value instanceof File),
	})

	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type PreviewData = ExpensePreviewData
	export const PreviewData = ExpensePreviewData
}
