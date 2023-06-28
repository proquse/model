import { isly } from "isly"
import { Cadence } from "../../Cadence"

export interface Creatable {
	type: "card"
	limit: Cadence
}
export namespace Creatable {
	export const type = isly.object<Creatable>({ type: isly.string("card"), limit: Cadence.type })
	export const is = type.is
	export const flaw = type.flaw
}
