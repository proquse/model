import { isoly } from "isoly"
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

export namespace PreviewData {}
