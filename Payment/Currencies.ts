import { isoly } from "isoly"
import { isly } from "isly"

export interface Currencies {
	available: isoly.Currency[]
}
export namespace Currencies {
	export const type = isly.object<Currencies>({
		available: isly.array(isly.fromIs("isoly.Currency", isoly.Currency.is)),
	})
	export const is = type.is
	export const flaw = type.flaw
}
