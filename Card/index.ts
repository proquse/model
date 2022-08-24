import { Amount } from "../Amount"
import { Creatable as CardCreatable } from "./Creatable"

export interface Card extends CardCreatable {
	card: string
}

export namespace Card {
	export function is(value: Card | any): value is Card & Record<string, any> {
		return (
			CardCreatable.is(value) &&
			typeof value.card == "string" &&
			value.card.match(/^[0-9]{16}\/(0[1-9]|1[0-2])[0-9]{2}\/[0-9]{3}\/[^\t-@\-`~]+\s[^\t-@\-`~]+$/) != null
		) //regex test match: 4200000000000000/1015/969/gjdfölskgj fsfghfkljjjjj
	}
	export function validate(value: Card, limit?: Amount) {
		return CardCreatable.validate(value, limit)
	}
	export type Creatable = CardCreatable
	export const Creatable = CardCreatable
}
