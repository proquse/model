import { isly } from "isly"

export interface MissingReceipt {
	type: "missing-receipt"
	level: number
	message?: string
}
export namespace MissingReceipt {
	export const type = isly.object<MissingReceipt>({
		type: isly.string("missing-receipt"),
		level: isly.number(),
		message: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
