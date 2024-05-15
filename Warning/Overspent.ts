import { isly } from "isly"
import { Base } from "./Base"

export interface Overspent extends Base {
	type: "overspent"
}
export namespace Overspent {
	export const type = Base.type.extend<Overspent>({
		type: isly.string("overspent"),
	})
	export const is = type.is
	export const flaw = type.flaw
}
