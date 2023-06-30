import { isoly } from "isoly"
import { Organization } from "@userwidgets/model"
import { isly } from "isly"
import { Purchase } from "../../Purchase"

export interface Preview {
	userExpenses: Record<Purchase["buyer"], Purchase[] | undefined>
	organization: Organization["id"]
	dateRange: isoly.DateRange
}

export namespace Preview {
	export const type = isly.object<Preview>({
		userExpenses: isly.record(isly.string(), isly.array(Purchase.type)),
		organization: isly.string(),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
