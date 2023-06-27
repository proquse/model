import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../../Cadence"

export interface Creatable {
	type: "card"
	limit: Cadence
}
export namespace Creatable {
	export const type = isly.object<Creatable>({ type: isly.string(["card"]), limit: Cadence.type })
	export const is = type.is
	export const flaw = type.flaw
	export function validate(card: Creatable, date: isoly.Date, limit?: Cadence): boolean {
		return Cadence.validate(card.limit, date, limit)
	}
}
