import { isly } from "isly"

export type Status = typeof Status.values[number]
export namespace Status {
	export const values = ["success", "failed"] as const
	export const type = isly.string<Status>(values)
	export const is = type.is
	export const flaw = type.flaw
}
