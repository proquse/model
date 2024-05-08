import { isly } from "isly"

export interface Overallocation {
	type: "overallocation"
	level: number
	days: number
	message?: string
}
export namespace Overallocation {
	export const type = isly.object<Overallocation>({
		type: isly.string("overallocation"),
		level: isly.number(),
		days: isly.number(),
		message: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
