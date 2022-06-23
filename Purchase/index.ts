import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Payment } from "../Payment"
import { Receipt } from "../Receipt"
import { Creatable } from "./Creatable"

export interface Purchase extends Creatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	buyer: string
	payment: Payment
	amount?: [number, isoly.Currency]
	receipt: Receipt | { to: string }
}
