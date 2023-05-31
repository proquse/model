import { isoly } from "isoly"

export interface Paid {
	created: isoly.Date
	issuer: string
}

export namespace Paid {
	export function is(value: Paid | any): value is Paid {
		return typeof value == "object" && value && isoly.Date.is(value.created) && typeof value.issuer === "string"
	}
}
