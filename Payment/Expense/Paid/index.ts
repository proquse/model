import { isoly } from "isoly"
import { isly } from "isly"
import { Creatable as PaidCreatable } from "./Creatable"

export interface Paid extends PaidCreatable {
	created: isoly.Date
	modified: isoly.Date
}

export namespace Paid {
	export const type: isly.object.ExtendableType<Paid> = PaidCreatable.type.extend<Paid>({
		created: isly.fromIs("Date", isoly.Date.is),
		modified: isly.fromIs("Date", isoly.Date.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = PaidCreatable
	export const Creatable = PaidCreatable
}
