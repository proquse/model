import { Amount } from "../Amount"

export interface Request {
	amount: Amount
	vat: number
	file: Blob
}

export namespace Request {
	export function is(value: Request | any): value is Request {
		return (
			typeof value == "object" && Amount.is(value.amount) && typeof value.vat == "number" && value.file instanceof Blob
		)
	}
}
