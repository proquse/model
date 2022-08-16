import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Creatable as DelegationCreatable } from "./Creatable"
import { Data as DelegationData } from "./Data"

export interface Delegation extends DelegationData {
	delegations: Delegation[]
}
export namespace Delegation {
	export type Creatable = DelegationCreatable
	export const Creatable = DelegationCreatable
	export type Data = DelegationData
	export const Data = DelegationData
	export function is(value: Delegation | any): value is Delegation & Record<string, any> {
		return (
			DelegationData.is(value) &&
			Array.isArray(value.delegations) &&
			value.delegations.every(delegation => Delegation.is(delegation))
		)
	}
	export function create(creatable: DelegationCreatable, idLength: cryptly.Identifier.Length = 8): Delegation {
		const now = isoly.DateTime.now()
		return {
			...creatable,
			id: cryptly.Identifier.generate(idLength),
			created: now,
			modified: now,
			purchases: [],
			delegations: [],
		}
	}
	export function findUser(delegation: Delegation, email: string): Delegation[] {
		const result: Delegation[] = []
		if (delegation.to.includes(email))
			result.push(delegation)
		else
			delegation.delegations.forEach(delegation => result.push(...findUser(delegation, email)))
		return result
	}
	export function find(root: Delegation, delegationId: string): Delegation | undefined {
		let result: Delegation | undefined = root.id == delegationId ? root : undefined
		return result ?? root.delegations.find(delegation => (result = find(delegation, delegationId))) ? result : undefined
	}
	export function findParent(root: Delegation, id: string): Delegation | undefined {
		let result: Delegation | undefined = undefined
		return root.delegations.find(delegation => delegation.id == id)
			? (result = root)
			: root.delegations.find(delegation => (result = findParent(delegation, id)))
			? result
			: undefined
	}
	export function findParents(
		root: Delegation,
		delegationId: string
	): [Delegation, Delegation, ...Delegation[]] | undefined {
		let result: Delegation[] | undefined = undefined
		root.delegations.find(delegation =>
			delegation.id == delegationId ? (result = []) : (result = findParents(delegation, delegationId))
		)
		return !result ? result : [root, ...result]
	}
	export function path(root: Delegation, delegationId: string): [Delegation, ...Delegation[]] | undefined {
		let result: Delegation[] | undefined = root.id == delegationId ? [] : undefined
		if (!result)
			root.delegations.find(delegation => (result = path(delegation, delegationId)))
		return !result ? result : [root, ...result]
	}
	export function change(root: Delegation, outdatedId: string, updated: Delegation): Delegation | undefined {
		const result = find(root, outdatedId)
		if (result) {
			Object.keys(result).forEach((key: keyof Delegation) => delete result[key])
			Object.assign(result, updated)
		}
		return result
	}
	export function remove(root: Delegation, id: string): Delegation | undefined {
		let result: Delegation | undefined = undefined
		const index = root.delegations.findIndex(delegation => delegation.id == id)
		return index >= 0
			? (result = root.delegations.splice(index, 1).shift())
			: root.delegations.find(delegation => (result = remove(delegation, id)))
			? result
			: undefined
	}
	export function spent(delegation: Delegation, includeOwnPurchases?: boolean): number {
		return includeOwnPurchases
			? delegation.purchases.reduce(
					(aggregate, current) => (current.amount == undefined ? aggregate : aggregate + current.amount[0]),
					delegation.delegations.reduce((aggregate, current) => aggregate + spent(current, true), 0)
			  )
			: delegation.delegations.reduce((aggregate, current) => aggregate + spent(current, true), 0)
	}
	export function balance(delegation: Delegation): number {
		return delegation.delegations.reduce(
			(aggregate, current) => aggregate - current.amount[0],
			delegation.purchases.reduce(
				(aggregate, current) => (current.amount == undefined ? aggregate : aggregate - current.amount[0]),
				delegation.amount[0]
			)
		)
	}
}
