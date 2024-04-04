import { isly } from "isly"

// reserved if latest operation is: authorized
// finalized if latest operation is: capture
// failed if latest operation is: status=failed
// should refund be finalized or failed?
export type Status = typeof Status.values[number]
export namespace Status {
	export const values = ["reserved", "finalized", "failed"] as const
	export const type = isly.string<Status>(values)
	export const is = type.is
	export const flaw = type.flaw
}
