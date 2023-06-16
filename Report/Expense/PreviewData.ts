import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../../Amount"
import { Paid } from "../../Payment/Expense/Paid"

export interface PreviewData {
	compileData: Record<string, { purpose: string; date: isoly.DateTime; amount: Amount; paid?: Paid }[]>
	organization: string
	dateRange: isoly.DateRange
}

export namespace PreviewData {
	export const type = isly.object<PreviewData>({
		compileData: isly.record(
			isly.string(),
			isly.array(
				isly.object({
					purpose: isly.string(),
					date: isly.fromIs("DateTime", isoly.DateTime.is),
					amount: Amount.type,
					paid: Paid.type.optional(),
				})
			)
		),
		organization: isly.string(),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
