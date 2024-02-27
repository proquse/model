import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
export interface Creatable {
	from: userwidgets.Email
	name: string
	amount: Cadence //make this optional?
	description?: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: userwidgets.Email.type,
		name: isly.string(/.+/),
		amount: Cadence.type,
		description: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
