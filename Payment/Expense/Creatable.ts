import { isly } from "isly"
import { Common } from "../Common"

export interface Creatable extends Common {
	type: "expense"
}
export namespace Creatable {
	export const type = Common.type.extend<Creatable>({
		type: isly.string("expense"),
	})
	export const is = type.is
	export const flaw = type.flaw
}
