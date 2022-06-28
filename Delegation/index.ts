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
	export function is(value: Delegation | any): value is Delegation & Record<string, any> {
		return (
			DelegationCreatable.is(value) &&
			(typeof value.costCenter == "string" || typeof value.costCenter == "undefined") &&
			isoly.DateTime.is(value.created) &&
			(typeof value.from == "string" || typeof value.from == "undefined") &&
			Array.isArray(value.delegations) &&
			value.delegations.every((delegation: any) => Delegation.is(delegation)) &&
			Array.isArray(value.purchases) &&
			value.purchases.every((purchase: any) => Purchase.is(purchase)) &&
			cryptly.Identifier.is(value.id)
		)
	}
}
