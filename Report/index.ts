import { isly } from "isly"
import { Creatable as ReportCreatable } from "./Creatable"
import { Expense as ReportExpense } from "./Expense"
import { Receipt as ReportReceipt } from "./Receipt"

export type Report = Report.Expense | Report.Receipt

export namespace Report {
	const type = isly.union<Report, Report.Expense, Report.Receipt>(ReportExpense.type, ReportReceipt.type)
	export type Receipt = ReportReceipt
	export const Receipt = ReportReceipt
	export namespace Receipt {
		export type Creatable = ReportReceipt.Creatable
	}
	export type Expense = ReportExpense
	export const Expense = ReportExpense
	export namespace Expense {
		export type Creatable = ReportExpense.Creatable
		export type PreviewData = ReportExpense.PreviewData
	}
	export type Creatable = ReportCreatable
	export const Creatable = ReportCreatable
	export namespace Creatable {
		export type Receipt = ReportCreatable.Receipt
		export type Expense = ReportCreatable.Expense
	}
	export const is = type.is
	export const flaw = type.flaw
}
