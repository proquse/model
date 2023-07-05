import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Purchase } from "../../Purchase"

export interface Preview {
	userExpenses: Record<Purchase["buyer"], Purchase[] | undefined>
	organization: userwidgets.Organization["name"]
	dateRange: isoly.DateRange
}

export namespace Preview {
	export const type = isly.object<Preview>({
		userExpenses: isly.record(userwidgets.Email.type, isly.array(Purchase.type)),
		organization: isly.string(/.+/),
		dateRange: isly.fromIs("DateRange", isoly.DateRange.is),
	})

	export const is = type.is
	export const flaw = type.flaw
}
