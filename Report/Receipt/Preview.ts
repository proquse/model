import { isoly } from "isoly"
import { isly } from "isly"
import { CostCenter } from "../../CostCenter"
import { Purchase } from "../../Purchase"
import { Receipt } from "../../Receipt"

export interface Preview {
	costCenters: {
		costCenter: CostCenter
		receipts: { receipt: Receipt; purchase: Purchase }[]
	}[]
	organization: string
	dateRange: isoly.DateRange
}

export namespace Preview {
	export const type = isly.object<Preview>({
		costCenters: isly.array(
			isly.object({
				costCenter: CostCenter.type,
				receipts: isly.array<Preview["costCenters"][number]["receipts"]>(
					isly.object({
						receipt: Receipt.type,
						purchase: Purchase.type,
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
