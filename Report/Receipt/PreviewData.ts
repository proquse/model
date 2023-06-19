import { isoly } from "isoly"
import { isly } from "isly"
import { Purchase } from "../../Purchase"
import { Receipt } from "../../Receipt"

export interface PreviewData {
	receiptsData: {
		costCenter: string
		receipts: { details: Receipt; purchase: Purchase; file: File }[]
	}[]
	organization: string
	dateRange: isoly.DateRange
}

export namespace PreviewData {
	export const type = isly.object<PreviewData>({
		receiptsData: isly.array(
			isly.object({
				costCenter: isly.string(),
				receipts: isly.array<PreviewData["receiptsData"][number]["receipts"]>(
					isly.object({
						details: Receipt.type,
						purchase: Purchase.type,
						file: isly.fromIs<File>("File", value => value instanceof File),
					})
				),
			})
		),
		organization: isly.string(),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
