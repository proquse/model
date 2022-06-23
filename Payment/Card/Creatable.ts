import * as isoly from "isoly"

export interface Creatable {
	type: "card"
	limit?: [number, isoly.Currency]
}
