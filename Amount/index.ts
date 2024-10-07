import { isoly } from "isoly"
import { isly } from "isly"

export interface Amount {
	value: number
	currency: isoly.Currency
}
export namespace Amount {
	export const type = isly.object<Amount>({
		value: isly.number(),
		currency: isly.fromIs("Currency", isoly.Currency.is),
	})
	export const is = type.is
	export const flaw = type.flaw
}
