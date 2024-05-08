import { isly } from "isly"
import { Overallocation as WarningOverallocation } from "./Overallocation"
import { Overspent as WarningOverspent } from "./Overspent"
import { MissingReceipt as WarningMissingReceipt } from "./Receipt"

export type Warning = Warning.Overallocation | Warning.Overspent | Warning.MissingReceipt
export namespace Warning {
	export import Overallocation = WarningOverallocation
	export import Overspent = WarningOverspent
	export import MissingReceipt = WarningMissingReceipt
	export const type = isly.union<Warning, Overallocation, Overspent, MissingReceipt>(
		Overallocation.type,
		Overspent.type,
		MissingReceipt.type
	)
	export const is = type.is
	export const flaw = type.flaw
}
