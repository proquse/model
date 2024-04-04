import { isly } from "isly"

// for poms:
// approved authorization = type=authorize; status=success
// declined authorization = type=authorize; status=failed
// reversal = type=refund; status=success
// settlement = type=capture; status=success
export type Status = typeof Status.values[number]
export namespace Status {
	export const values = ["success", "failed"] as const
	export const type = isly.string<Status>(values)
	export const is = type.is
	export const flaw = type.flaw
}
