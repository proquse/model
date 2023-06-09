import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import type { CostCenter } from "../CostCenter"
import { Purchase } from "../Purchase"
import { Creatable as DelegationCreatable } from "./Creatable"

export interface Delegation extends Delegation.Creatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	purchases: Purchase[]
	delegations: Delegation[]
}
export namespace Delegation {
	export type Creatable = DelegationCreatable
	export const Creatable = DelegationCreatable
	export const type: isly.object.ExtendableType<Delegation> = Creatable.type.extend<Delegation>({
		id: isly.fromIs<cryptly.Identifier>("Identifier", cryptly.Identifier.is),
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		purchases: isly.array(isly.fromIs("Purchase", Purchase.is)),
		delegations: isly.array(isly.lazy(() => type, "Delegation")),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function create(
		delegation: Delegation.Creatable,
		override?: Partial<Delegation>,
		idLength: cryptly.Identifier.Length = 8
	): Delegation {
		const now = isoly.DateTime.now()
		return {
			...delegation,
			...override,
			id: override?.id ?? cryptly.Identifier.generate(idLength),
			created: override?.created ?? now,
			modified: override?.modified ?? now,
			purchases: override?.purchases ?? [],
			delegations: override?.delegations ?? [],
		}
	}
	function changeCostCenter(root: Delegation, costCenter: string): string {
		root.delegations.forEach(delegation => changeCostCenter(delegation, costCenter))
		return (root.costCenter = costCenter)
	}
	export function change(
		roots: Delegation[],
		updated: Delegation
	): { root: Delegation; changed: Delegation } | undefined {
		const search = find(roots, updated.id)
		let result: { root: Delegation; changed: Delegation } | undefined = search && {
			root: search.root,
			changed: search.found,
		}
		!(result && updated.costCenter != result.changed.costCenter) ||
			(result.root == result.changed ? changeCostCenter(result.root, updated.costCenter) : (result = undefined))
		result &&
			((Object.keys(result.changed) as (keyof Delegation)[]).forEach(key => result && delete result.changed[key]),
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
	export function findUser<T extends Delegation | CostCenter>(roots: T[], email: string): Delegation[] {
		const result: Delegation[] = []
		for (const root of roots) {
			if ("costCenters" in root)
				result.push(...findUser(root.costCenters, email))
			else
				root.to.includes(email) && result.push(root)
			result.push(...findUser(root.delegations, email))
		}
		return result
	}
	export function find<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; found: Delegation } | undefined {
		const search = roots.find(root => root.id == id)
		let result: { root: T; found: Delegation } | undefined =
			search && "purchases" in search ? { root: search, found: search } : undefined
		return (
			result ??
			(roots.find(
				root =>
					(result = (result => (!result ? result : { ...result, root }))(
						find(root.delegations, id) ?? ("costCenters" in root ? find(root.costCenters, id) : undefined)
					))
			) &&
				result)
		)
	}
	// fix this with casting? =[
	export function findParent<
		T extends Delegation | CostCenter,
		TResult extends T extends Delegation ? Delegation | CostCenter : T
	>(roots: T[], id: string): { root: TResult; found: TResult } | undefined {
		let result: { root: TResult; found: TResult } | undefined
		return roots.find(
			root => root.delegations.find(delegation => delegation.id == id) && (result = { root: root, found: root })
		)
			? result
			: roots.find(
					root => (result = (result => (!result ? result : { ...result, root }))(findParent(root.delegations, id)))
			  ) && result
	}
	export function findParents<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): (T | Delegation)[] | undefined {
		let result: (T | Delegation)[] | undefined = roots.find(root => root.id == id) && []
		return result
			? result
			: roots.find(root => (result = findParents(root.delegations, id)) && (result = [root, ...result])) && result
	}
	export function path<T extends Delegation | CostCenter>(roots: T[], id: string): (T | Delegation)[] | undefined {
		const found = roots.find(root => root.id == id)
		let result: (T | Delegation)[] | undefined = found ? [found] : []
		return result?.length
			? result
			: roots.find(root => (result = path(root.delegations, id)) && (result = [root, ...result])) && result
	}
	export function spent<T extends Delegation | CostCenter>(root: T, includeOwnPurchases?: boolean): number {
		return [...root.delegations, ...("costCenters" in root ? root.costCenters : [])].reduce(
			(result, current) => result + spent(current, true),
			includeOwnPurchases && "purchases" in root
				? root.purchases.reduce(
						(result, current) => (current.amount == undefined ? result : result + current.amount[0]),
						0
				  )
				: 0
		)
	}
	export function balance<T extends Delegation | CostCenter>(root: T): number {
		return [...root.delegations, ...("costCenters" in root ? root.costCenters : [])].reduce(
			(result, current) => result - current.amount[0],
			"purchases" in root
				? root.purchases.reduce((result, current) => result - current.payment.limit[0], root.amount[0])
				: root.amount[0]
		)
		// return root.delegations.reduce(
		// 	(result, current) => result - current.amount[0],
		// 	root.purchases.reduce(
		// 		(result, current) => (current.payment.limit == undefined ? result : result - current.payment.limit[0]),
		// 		root.amount[0]
		// 	)
		// )
	}
}
const costCenter: CostCenter[] = []
const delegation: Delegation[] = []
const costCenterResult = Delegation.findParent(costCenter, "asd@qwe.com")
const delegationResult = Delegation.findParent(delegation, "asd@qwe.com")
console.log(costCenterResult, delegationResult)
