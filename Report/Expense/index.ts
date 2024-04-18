import { isly } from "isly"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Preview as ExpensePreview } from "./Preview"
export interface Expense {
	file: File
}

export namespace Expense {
	export import Creatable = ExpenseCreatable
	export import Preview = ExpensePreview
	export const type = isly.object<Expense>({
		file: isly.fromIs<File>("File", value => value instanceof File),
	})
	export const is = type.is
	export const flaw = type.flaw
}
