import { isly } from "isly"
import { Base } from "./Base"

export interface Overallocation extends Base {
	type: "overallocation"
	days: number
}
export namespace Overallocation {
	export const type = Base.type.extend<Overallocation>({
		type: isly.string("overallocation"),
		days: isly.number(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
