import { isly } from "isly"
import type { Warning } from "../index"
import { type as WarningType } from "../type"

export interface Entry {
	value: Warning[]
	child: Warning[]
}
export namespace Entry {
	export const type = isly.object<Entry>({
		value: isly.array(WarningType),
		child: isly.array(WarningType),
	})
	export const is = type.is
	export const flaw = type.flaw
}
