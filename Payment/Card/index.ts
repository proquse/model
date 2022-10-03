import { Token as CardToken } from "./Token"

export interface Card {
	cvc: string
	pan: string
	holder: string
	expire: {
		year: string
		month: string
	}
}
export namespace Card {
	export function is(card: Card | any): card is Card & Record<string, any> {
		return (
			typeof card == "object" &&
			typeof card.pan == "string" &&
			!!card.pan.match(/\d{16}/) &&
			typeof card.cvc == "string" &&
			!!card.cvc.match(/^\d\d\d$/) &&
			typeof card.holder == "string" &&
			typeof card.expire == "object" &&
			typeof card.expire.month == "string" &&
			!!card.expire.month.match(/^0[1-9]|1[012]$/) &&
			typeof card.expire.year == "string" &&
			!!card.expire.year.match(/^\d\d$/)
		)
	}
	export type Token = CardToken
	export namespace Token {
		export type Creatable = CardToken.Creatable
		export const Creatable = CardToken.Creatable
		export const is = CardToken.is
		export const validate = CardToken.validate
		export const create = CardToken.create
	}
}
