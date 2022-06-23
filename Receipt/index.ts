import * as isoly from "isoly"

export interface Receipt {
	original: string
	amount: number
	vat: number
	currency: isoly.Currency
}
