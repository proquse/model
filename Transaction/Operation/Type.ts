import { isly } from "isly"

// for poms:
// authorize if: type=authorization
// capture if: type=settlement
// refund if: type=reversal
export type Type = typeof Type.values[number]
export namespace Type {
	export const values = ["authorize", "capture", "refund"] as const
	export const type = isly.string<Type>(values)
	export const is = type.is
	export const flaw = type.flaw
}
