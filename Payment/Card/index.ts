import { isly } from "isly"
import { Creatable as CardCreatable } from "./Creatable"
import { Internal as CardInternal } from "./Internal"

export interface Card extends Card.Creatable {
	token?: string
}
export namespace Card {
	export import Internal = CardInternal
	export import Creatable = CardCreatable
	export const type = Creatable.type.extend<Card>({
		token: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
