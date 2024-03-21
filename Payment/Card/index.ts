import { isly } from "isly"
import { Creatable as CardCreatable } from "./Creatable"

export interface Card extends Omit<Card.Creatable, "key"> {
	reference: string
	token?: string
}
export namespace Card {
	export import Creatable = CardCreatable
	export const type = Creatable.type.omit(["key"]).extend<Card>({
		reference: isly.string(),
		token: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
