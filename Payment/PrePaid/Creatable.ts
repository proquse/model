import { isly } from "isly"
import { Cadence } from "../../Cadence"

export interface Creatable {
	type: "pre-paid"
	limit: Cadence
}
export namespace Creatable {
	export const type = isly.object<Creatable>({ type: isly.string("pre-paid"), limit: Cadence.type })
	export const is = type.is
	export const flaw = type.flaw
}
