import * as cryptly from "cryptly"
import * as isoly from "isoly"
import { Amount } from "../Amount"
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
	export function create(
		creatable: DelegationCreatable,
		from: string,
		idLength: cryptly.Identifier.Length = 8
	): Delegation {
		const now = isoly.DateTime.now()
		return {
			...creatable,
			id: cryptly.Identifier.generate(idLength),
			from: from,
			created: now,
			modified: now,
			purchases: [],
			delegations: [],
		}
	}
	export function findUser(roots: Delegation[], email: string): Delegation[] {
		const result: Delegation[] = []
		roots.forEach(root => root.to.includes(email) && result.push(root))
		roots.forEach(root => result.push(...findUser(root.delegations, email)))
		return result
	}
	export function find(roots: Delegation[], id: string): { root: Delegation; found: Delegation } | undefined {
		let result: { root: Delegation; found: Delegation } | undefined
		roots.find(root => root.id == id && (result = { root: root, found: root }))
		return result ?? (roots.find(root => (result = find(root.delegations, id)) && (result.root = root)) && result)
	}
	export function findParent(roots: Delegation[], id: string): { root: Delegation; found: Delegation } | undefined {
		let result: { root: Delegation; found: Delegation } | undefined
		return roots.find(
			root => root.delegations.find(delegation => delegation.id == id) && (result = { root: root, found: root })
		)
			? result
			: roots.find(root => (result = findParent(root.delegations, id)) && (result.root = root)) && result
	}
	export function findParents(roots: Delegation[], id: string): Delegation[] | undefined {
		let result: Delegation[] | undefined = roots.find(root => root.id == id) && []
		return result
			? result
			: roots.find(root => (result = findParents(root.delegations, id)) && (result = [root, ...result])) && result
	}
	export function path(roots: Delegation[], id: string): Delegation[] | undefined {
		let result: Delegation[] | undefined = [roots.find(root => root.id == id) ?? []].flat()
		return result.length
			? result
			: roots.find(root => (result = path(root.delegations, id)) && (result = [root, ...result])) && result
	}
	function changeCostCenter(root: Delegation, costCenter: string): string {
		root.delegations.forEach(delegation => changeCostCenter(delegation, costCenter))
		return (root.costCenter = costCenter)
	}
	export function change(
		roots: Delegation[],
		updated: Delegation
	): { root: Delegation; changed: Delegation } | false | undefined {
		const search = find(roots, updated.id)
		let result: { root: Delegation; changed: Delegation } | false | undefined = search && {
			root: search.root,
			changed: search.found,
		}
		!(result && updated.costCenter != result.changed.costCenter) ||
			(result.root == result.changed ? changeCostCenter(result.root, updated.costCenter) : (result = false))
		result &&
			(Object.keys(result.changed).forEach((key: keyof Delegation) => result && delete result.changed[key]),
			Object.assign(result.changed, updated))
		return result
	}
	export function remove(roots: Delegation[], id: string): { root: Delegation; removed: Delegation } | undefined {
		let result: { root: Delegation; removed: Delegation } | undefined
		const index = roots.findIndex(root => root.id == id && (result = { root: root, removed: root }))
		index >= 0 && roots.splice(index, 1)
		return result
			? result
			: roots.find(root => (result = remove(root.delegations, id)) && (result.root = root)) && result
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
				(aggregate, current) => (current.payment.limit == undefined ? aggregate : aggregate - current.payment.limit[0]),
				delegation.amount[0]
			)
		)
	}
	export function validate(delegation: Delegation, limit?: Amount): boolean {
		const equity = balance(delegation)
		return (
			!!delegation.id &&
			delegation.created <= delegation.modified &&
			delegation.modified <= isoly.DateTime.now() &&
			!!delegation.from &&
			!!delegation.costCenter &&
			Delegation.Creatable.validate(delegation, limit) &&
			0 <= equity &&
			(!limit || equity <= limit[0]) &&
			balance(delegation) >= 0 &&
			delegation.delegations.every(delegation => Delegation.validate(delegation, delegation.amount))
		)
	}
}
