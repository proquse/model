import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../../Amount"
import { Purchase } from "../../Purchase"
import { Creatable } from "../Creatable"
import type { Delegation } from "../index"

export interface Data extends Creatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	from: string
	costCenter: string
	purchases: Purchase[]
}

export namespace Data {
	export function is(value: Data | any): value is Data & Record<string, any> {
		return (
			Creatable.is(value) &&
			isoly.DateTime.is(value.created) &&
			isoly.DateTime.is(value.modified) &&
			typeof value.from == "string" &&
			typeof value.costCenter == "string" &&
			Array.isArray(value.purchases) &&
			value.purchases.every(purchase => Purchase.is(purchase)) &&
			cryptly.Identifier.is(value.id)
		)
	}
	export function to(delegation: Delegation): Data {
		return Object.fromEntries(
			Object.entries(delegation).filter(([key, _]: [keyof Delegation, any]) => key != "delegations")
		) as Data
	}
	export function validate(value: Data, limit?: Amount) {
		return (
			Creatable.validate(value, limit) &&
			!!value.id &&
			!!value.costCenter &&
			value.created <= value.modified &&
			value.modified <= isoly.DateTime.now() &&
			!!value.from &&
			value.purchases.every(purchase => Purchase.validate(purchase)) &&
			value.purchases.reduce((aggregate, current) => {
				return aggregate + (current.amount?.[0] ?? 0)
			}, 0) <= value.amount[0]
		)
	}
}
