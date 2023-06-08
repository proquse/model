import { isoly } from "isoly"
import { isly } from "isly"

export interface Paid {
	created: isoly.Date
	issuer: string
}

export namespace Paid {
	export const type = isly.object<Paid>({ created: isly.fromIs("date", isoly.Date.is), issuer: isly.string() })

	export const is = type.is
	export const flaw = type.flaw
}
