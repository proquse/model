import { isoly } from "isoly"
import { isly } from "isly"

export interface Merchant {
	descriptor: string
	country: string
	category: string
}
export namespace Merchant {
	export const type = isly.object<Merchant>({
		descriptor: isly.string(),
		country: isly.fromIs("isoly.CountryCode.Alpha2", isoly.CountryCode.Alpha2.is),
		category: isly.string(),
	})
}
