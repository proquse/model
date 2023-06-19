import { isly } from "isly"

export interface Details {
	csc: string
	pan: string
	holder: string
	expire: {
		year: string
		month: string
	}
}
export namespace Details {
	export const type = isly.object<Details>({
		csc: isly.string(/^\d\d\d$/),
		pan: isly.string(/\d{16}/),
		holder: isly.string(),
		expire: isly.object({ year: isly.string(/^\d\d$/), month: isly.string(/^(0[1-9]|1[012])$/) }),
	})

	export const is = type.is
	export const flaw = type.flaw

	// export function is(value: Details | any): value is Details {
	// 	return !!(
	// 		typeof value == "object" &&
	// 		value &&
	// 		typeof value.csc == "string" &&
	// 		typeof value.pan == "string" &&
	// 		value.pan.match(/\d{16}/) &&
	// 		typeof value.csc == "string" &&
	// 		value.csc.match(/^\d\d\d$/) &&
	// 		typeof value.holder == "string" &&
	// 		typeof value.expire == "object" &&
	// 		value.expire &&
	// 		typeof value.expire.year == "string" &&
	// 		value.expire.year.match(/^\d\d$/) &&
	// 		typeof value.expire.month == "string" &&
	// 		value.expire.month.match(/^(0[1-9]|1[012])$/)
	// 	)
	// }
}
