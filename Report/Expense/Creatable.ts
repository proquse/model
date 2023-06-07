import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../../Amount"

export interface Creatable {
	compileData: Record<string, { purpose: string; date: isoly.Date; amount: Amount }[]>
	organization: string
	dateRange: isoly.DateRange
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		compileData: isly.record(
			isly.string(),
			isly.array(
				isly.object({
					purpose: isly.string(),
					date: isly.fromIs<isoly.Date>("Date", value => isoly.DateTime.is(value)),
					amount: isly.fromIs<Amount>("Amount", value => Amount.is(value)),
				})
			)
		),
		organization: isly.string(),
		dateRange: isly.fromIs<isoly.DateRange>("DateRange", value => isoly.DateRange.is(value)),
	})

	export const is = type.is
	export const flaw = type.flaw
}
