import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { isly } from "isly"
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
	export const type = Creatable.type.extend<Data>({
		id: isly.fromIs<cryptly.Identifier>("Identifier", cryptly.Identifier.is),
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		from: isly.string(),
		costCenter: isly.string(),
		purchases: isly.array(isly.fromIs("Purchase", Purchase.is)),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function to(delegation: Delegation): Data {
		return Object.fromEntries(Object.entries(delegation).filter(([key, _]) => key != "delegations")) as Data
	}
	export function validate(delegation: Data, limit?: Amount, costCenter = false): boolean {
		return (
			Creatable.validate(delegation, limit, costCenter) &&
			!!delegation.id &&
			!!delegation.costCenter &&
			delegation.created <= delegation.modified &&
			delegation.modified <= isoly.DateTime.now() &&
			!!delegation.from &&
			delegation.purchases.every(purchase => Purchase.validate(purchase)) &&
			delegation.purchases.reduce((aggregate, current) => {
				return aggregate + (current.amount?.[0] ?? 0)
			}, 0) <= delegation.amount[0]
		)
	}
}
