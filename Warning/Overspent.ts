import { isly } from "isly"

export interface Overspent {
	type: "overspent"
	level: number
	message?: string
}
export namespace Overspent {
	export const type = isly.object<Overspent>({
		type: isly.string("overspent"),
		level: isly.number(),
		message: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
