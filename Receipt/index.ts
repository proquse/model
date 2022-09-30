import * as cryptly from "cryptly"
import { Amount } from "../Amount"

export interface Receipt {
	id: cryptly.Identifier
	original: string
	amount: Amount
	vat: number
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number"
		)
	}
	export function validate(value: Receipt, limit?: Amount) {
		return (
			!!value.id &&
			!!value.original &&
			Amount.validate(value.amount, limit) &&
			value.amount[0] > 0 &&
			value.vat >= 0 &&
			value.vat <= 1
		)
	}
}
