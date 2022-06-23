import * as isoly from "isoly"
import { Creatable as CardCreatable } from "./Creatable"

export interface Card {
	type: "card"
	limit?: [number, isoly.Currency]
	card: string
}

export namespace Card {
	export type Creatable = CardCreatable
}
