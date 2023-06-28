import { isly } from "isly"
import { Creatable as CardCreatable } from "./Creatable"
import { Details as CardDetails } from "./Details"

export interface Card extends Card.Creatable {
	details?: Card.Details
}
export namespace Card {
	export const type: isly.object.ExtendableType<Card> = CardCreatable.type.extend<Card>({
		details: CardDetails.type.optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = CardCreatable
	export const Creatable = CardCreatable
	export type Details = CardDetails
	export const Details = CardDetails
}
