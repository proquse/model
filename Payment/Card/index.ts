import { Token as CardToken } from "./Token"

export interface Card {
	cvc: string
	pan: string
	cardHolder: string
	expire_month: string
	expire_year: string
}
export namespace Card {
	export function is(value: Card | any): value is Card & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.cvc == "string" &&
			typeof value.cardHolder == "string" &&
			typeof value.expire_month == "string" &&
			value.expire_month.match(/^0\d|1[012]$/) &&
			typeof value.expire_year == "string" &&
			value.expire_year.match(/^\d\d$/)
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
