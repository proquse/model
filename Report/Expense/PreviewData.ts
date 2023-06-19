import { isoly } from "isoly"
import { isly } from "isly"
import { Purchase } from "./../../Purchase"

export interface PreviewData {
	compileData: Record<string, Purchase[]>
	organization: string
	dateRange: isoly.DateRange
}

export namespace PreviewData {
	export const type = isly.object<PreviewData>({
		compileData: isly.record(isly.string(), isly.array(Purchase.type)),
		organization: isly.string(),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
