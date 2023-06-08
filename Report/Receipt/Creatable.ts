import { isoly } from "isoly"
import { isly } from "isly"
import { Purchase } from "../../Purchase"
import { Receipt } from "../../Receipt"

export interface Creatable {
	receiptData: {
		costCenter: string
		receipts: { details: Receipt; file: File; purchase: Purchase }[]
	}[]
	organization: string
	dateRange: isoly.DateRange
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		receiptData: isly.array(
			isly.object({
				costCenter: isly.string(),
				receipts: isly.array(
					isly.object<{ details: Receipt; file: File; purchase: Purchase }>({
						details: isly.fromIs<Receipt>("Receipt", Receipt.is),
						file: isly.fromIs<File>("File", value => value instanceof File),
						purchase: isly.fromIs<Purchase>("Purchase", Purchase.is),
					})
				),
			})
		),
		organization: isly.string(),
		dateRange: isly.fromIs<isoly.DateRange>("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
