import { isly } from "isly"
import { Common } from "../Common"

export interface Creatable extends Common {
	type: "card"
	key?: string
}
export namespace Creatable {
	export const type = Common.type.extend<Creatable>({
		type: isly.string("card"),
		key: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
