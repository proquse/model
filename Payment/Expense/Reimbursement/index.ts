import { isoly } from "isoly"
import { isly } from "isly"
import { Creatable as ReimbursementCreatable } from "./Creatable"

export interface Reimbursement extends Reimbursement.Creatable {
	created: isoly.DateTime
	modified: isoly.DateTime
}

export namespace Reimbursement {
	export const type = ReimbursementCreatable.type.extend<Reimbursement>({
		created: isly.fromIs("Date", isoly.DateTime.is),
		modified: isly.fromIs("Date", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ReimbursementCreatable
	export const Creatable = ReimbursementCreatable
}
