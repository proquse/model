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
	export function is(value: Card | any): value is Card & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.pan == "string" &&
			!!value.pan.match(/\d{16}/) &&
			typeof value.cvc == "string" &&
			!!value.cvc.match(/^\d\d\d$/) &&
			typeof value.holder == "string" &&
			typeof value.expire == "object" &&
			typeof value.expire.month == "string" &&
			!!value.expire.month.match(/^0[1-9]|1[012]$/) &&
			typeof value.expire.year == "string" &&
			!!value.expire.year.match(/^\d\d$/)
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
