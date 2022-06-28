import { Creatable as CardCreatable } from "./Creatable"

export interface Card extends CardCreatable {
	card: string
}

export namespace Card {
	export function is(value: Card | any): value is Card & Record<string, any> {
		return CardCreatable.is(value) && typeof value.card == "string"
	}
	export type Creatable = CardCreatable
	export const Creatable = CardCreatable
}
