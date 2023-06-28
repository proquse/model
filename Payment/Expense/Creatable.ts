import { isly } from "isly"
import { Cadence } from "../../Cadence"

export interface Creatable {
	type: "expense"
	limit: Cadence
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		type: isly.string("expense"),
		limit: Cadence.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
