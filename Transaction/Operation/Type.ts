import { isly } from "isly"

export type Type = typeof Type.values[number]
export namespace Type {
	export const values = ["authorize", "capture", "refund"] as const
	export const type = isly.string<Type>(values)
	export const is = type.is
	export const flaw = type.flaw
}
