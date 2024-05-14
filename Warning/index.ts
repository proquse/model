// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isly } from "isly"
import { MissingReceipt as WarningMissingReceipt } from "./MissingReceipt"
import { Overallocation as WarningOverallocation } from "./Overallocation"
import { Overspent as WarningOverspent } from "./Overspent"
import { Record as WarningRecord } from "./Record"
import { Severity as WarningSeverity } from "./Severity"
import { type as WarningType } from "./type"

export type Warning = Warning.Overallocation | Warning.Overspent | Warning.MissingReceipt
export namespace Warning {
	export import Severity = WarningSeverity
	export import Overallocation = WarningOverallocation
	export import Overspent = WarningOverspent
	export import MissingReceipt = WarningMissingReceipt
	export import Record = WarningRecord
	export const type = WarningType
	export const is = type.is
	export const flaw = type.flaw
}
