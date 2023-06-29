import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Email } from "../Email"
export interface Creatable {
	from: Email
	name: string
	amount: Cadence
	description?: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: Email.type,
		name: isly.string(/.+/),
		amount: Cadence.type,
		description: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
