import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Purchase } from "../Purchase"
import { Creatable as DelegationCreatable } from "./Creatable"

export interface Delegation extends DelegationCreatable {
	id: cryptly.Identifier
	costCenter?: string
	created: isoly.DateTime
	modified: isoly.DateTime
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
			isoly.DateTime.is(value.modified) &&
			(typeof value.from == "string" || typeof value.from == "undefined") &&
			Array.isArray(value.delegations) &&
			value.delegations.every((delegation: any) => Delegation.is(delegation)) &&
			Array.isArray(value.purchases) &&
			value.purchases.every((purchase: any) => Purchase.is(purchase)) &&
			cryptly.Identifier.is(value.id)
		)
	}
	export function findUser(delegation: Delegation, email: string, recursive = false): Delegation[] {
		const found: Delegation[] = []
		if (delegation.to.includes(email))
			found.push(delegation)
		else
			delegation.delegations.forEach(delegation => found.push(...findUser(delegation, email)))

		return found
	}
	export function find(root: Delegation, delegationId: string): Delegation | undefined {
		let result: Delegation | undefined = root.id == delegationId ? root : undefined
		if (!result)
			root.delegations.find(delegation => (result = find(delegation, delegationId)))
		return result
	}

	export function change(root: Delegation, outdatedId: string, updated: Delegation): Delegation | undefined {
		let result: Delegation | undefined = undefined
		const old = find(root, outdatedId)
		if (old) {
			Object.keys(old).forEach((key: keyof Delegation) => delete old[key])
			Object.assign(old, updated)
			result = old
		}
		return result
	}
	export function remove(root: Delegation, id: string): Delegation | undefined {
		let result: Delegation | undefined = undefined
		const index = root.delegations.findIndex(delegation => delegation.id == id)
		if (index >= 0)
			result = root.delegations.splice(index, 1).shift()
		else
			root.delegations.find(delegation => (result = remove(delegation, id)))
		return result
	}

	export function spent(delegation: Delegation): number {
		return delegation.purchases.reduce(
			(aggregate, current) => (current.amount == undefined ? aggregate : aggregate + current.amount[0]),
			delegation.delegations.reduce((aggregate, current) => aggregate + spent(current), 0)
		)
	}
}
