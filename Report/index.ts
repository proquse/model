import { isly } from "isly"
import { Creatable as ReportCreatable } from "./Creatable"
import { Expense as ReportExpense } from "./Expense"
import { Receipt as ReportReceipt } from "./Receipt"

export type Report = Report.Expense | Report.Receipt

export namespace Report {
	const type = isly.union<Report, Report.Expense, Report.Receipt>(ReportExpense.type, ReportReceipt.type)
	export import Receipt = ReportReceipt
	export import Expense = ReportExpense
	export import Creatable = ReportCreatable
	export const is = type.is
	export const flaw = type.flaw
}
