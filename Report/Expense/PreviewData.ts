import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../../Cadence"

export interface PreviewData {
	compileData: Record<string, { purpose: string; date: isoly.Date; amount: Cadence }[]>
	organization: string
	dateRange: isoly.DateRange
}

export namespace PreviewData {
	const type = isly.object<PreviewData>({
		compileData: isly.record(
			isly.string(),
			isly.array(isly.object({ purpose: isly.string(), date: isly.fromIs("Date", isoly.Date.is), amount: Amount.type }))
		),
		organization: isly.string(),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
