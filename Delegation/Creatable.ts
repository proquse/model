import * as isoly from "isoly"

export interface Creatable {
	to: string[]
	purpose: string
	amount: [number, isoly.Currency]
}
