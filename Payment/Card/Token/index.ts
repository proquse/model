import { Amount } from "../../../Amount"
import { Creatable as CreatableToken } from "./Creatable"

export interface Token extends CreatableToken {
	value: string
	supplier: string
}

export namespace Token {
	export function is(value: Token | any): value is Token & Record<string, any> {
		return CreatableToken.is(value) && typeof value.value == "string" && typeof value.supplier == "string"
	}
	export function create(token: Creatable, value: string, supplier: string) {
		return { ...token, value: value, supplier: supplier }
	}
	export function validate(value: Token, limit?: Amount) {
		return CreatableToken.validate(value, limit) && !!value.value && !!value.supplier
	}
	export type Creatable = CreatableToken
	export namespace Creatable {
		export const is = CreatableToken.is
		export const validate = CreatableToken.validate
	}
}
