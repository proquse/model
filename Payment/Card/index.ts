import { Amount } from "../../Amount"
import { Creatable as CardCreatable } from "./Creatable"
import { Details as CardDetails } from "./Details"

export interface Card {
	type: "card"
	limit: Amount
	details?: Card.Details
}
export namespace Card {
	export function is(value: Card | any): value is Card {
		return (
			typeof value == "object" &&
			value &&
			value.type == "card" &&
			Amount.is(value.limit) &&
			(value.details == undefined || Details.is(value.details))
		)
	}
	export function validate(card: Card, limit?: Amount): boolean {
		return Amount.validate(card.limit, limit)
	}
	export type Creatable = CardCreatable
	export const Creatable = CardCreatable
	export type Details = CardDetails
	export const Details = CardDetails
}
