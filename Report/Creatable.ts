import { isly } from "isly"
import { Expense as ReportExpense } from "./Expense"
import { Receipt as ReportReceipt } from "./Receipt"

export type Creatable = Creatable.Expense | Creatable.Receipt

export namespace Creatable {
	const type = isly.union<Creatable, Creatable.Expense, Creatable.Receipt>(
		ReportExpense.Creatable.type,
		ReportReceipt.Creatable.type
	)

	export const is = type.is
	export const flaw = type.flaw
	export type Expense = ReportExpense.Creatable
	export const Expense = ReportExpense.Creatable
	export type Receipt = ReportReceipt.Creatable
	export const Receipt = ReportReceipt.Creatable
}
