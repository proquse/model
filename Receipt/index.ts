import { Amount } from "../Amount"

export interface Receipt {
	original: string
	amount: Amount
	vat: number
	// currency: isoly.Currency
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			typeof value.original == "string" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number"
		)
	}
	export function validate(value: Receipt, limit?: Amount) {
		return (
			!!value.original &&
			Amount.validate(value.amount, limit) &&
			value.amount[0] > 0 &&
			value.vat >= 0 &&
			value.vat <= 1
		)
	}
}
