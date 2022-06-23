import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Purchase } from "../Purchase"
import { Creatable as DelegationCreatable } from "./Creatable"

export interface Delegation extends DelegationCreatable {
	id: cryptly.Identifier
	costCenter?: string
	created: isoly.DateTime
	from?: string
	delegations: Delegation[]
	purchases: Purchase[]
}
export namespace Delegation {
	export type Creatable = DelegationCreatable
}
