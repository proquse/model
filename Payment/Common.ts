import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../Cadence"

export interface Common {
	type: string
	limit: Cadence
	rates?: { [currency in isoly.Currency]?: number }
}
export namespace Common {
	export const type = isly.object<Common>({
		type: isly.string(),
		limit: Cadence.type,
		rates: isly.record(isly.fromIs("isoly.Currency", isoly.Currency.is), isly.number().optional()).optional(),
	})
}
