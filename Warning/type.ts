import { isly } from "isly"
import type { Warning } from "./index"
import { MissingReceipt } from "./MissingReceipt"
import { Overallocation } from "./Overallocation"
import { Overspent } from "./Overspent"

export const type = isly.union<Warning, Overallocation, Overspent, MissingReceipt>(
	Overallocation.type,
	Overspent.type,
	MissingReceipt.type
)
