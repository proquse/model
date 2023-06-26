import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../Amount"
import type { CostCenter } from "../CostCenter"
import { Purchase } from "../Purchase"
import { changeDelegation } from "./change"
import { Creatable as DelegationCreatable } from "./Creatable"
import { findDelegation, findNode } from "./find"

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
	export const change = changeDelegation
	export function remove<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; removed: Delegation } | undefined {
		let result: { root: T; removed: Delegation } | undefined
		const index = roots.findIndex(
			root => root.id == id && "purchases" in root && (result = { root: root, removed: root })
		)
		if (index >= 0)
			roots.splice(index, 1)
		return result
			? result
			: roots.find(
					root => (result = (result => (!result ? result : { ...result, root }))(remove(root.delegations, id)))
			  ) && result
	}
	export const find = Object.assign(findDelegation, { node: findNode })
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
	export function findParent<
		T extends Delegation | CostCenter,
		TResult extends T extends Delegation ? Delegation | CostCenter : T
	>(roots: T[], id: string): { root: TResult; found: TResult } | undefined {
		let result: { root: TResult; found: TResult } | undefined
		return roots.find(
			root =>
				root.delegations.find(delegation => delegation.id == id) &&
				(result = { root: root as any as TResult, found: root as any as TResult })
		)
			? result
			: roots.find(
					root =>
						(result = (result =>
							!result ? result : ({ ...result, root } as unknown as { root: TResult; found: TResult }))(
							findParent(root.delegations, id)
						))
			  ) && result
	}
	export function findParents<
		T extends Delegation | CostCenter,
		TResult extends T extends Delegation ? Delegation | CostCenter : T
	>(roots: T[], id: string): TResult[] | undefined {
		let result: TResult[] | undefined = roots.find(root => root.id == id) && []
		return result
			? result
			: roots.find(
					root => (result = findParents(root.delegations, id)) && (result = [root as unknown as TResult, ...result])
			  ) && result
	}
	export function path<
		T extends Delegation | CostCenter,
		TResult extends T extends Delegation ? Delegation | CostCenter : T
	>(roots: T[], id: string): TResult[] | undefined {
		const found = roots.find(root => root.id == id) as TResult
		let result: TResult[] | undefined = found ? [found] : []
		return result?.length
			? result
			: roots.find(
					root => (result = path(root.delegations, id)) && (result = [root as unknown as TResult, ...result])
			  ) && result
	}
	export const spent = Object.assign(calculateSpent, { balance: calculateSpentBalance })
	function calculateSpent(root: Delegation | CostCenter, options?: { rootPurchases?: boolean; vat?: boolean }): number {
		return [...root.delegations, ...("costCenters" in root ? root.costCenters : [])].reduce(
			(result, current) => result + spent(current, { ...options, rootPurchases: true }),
			!options?.rootPurchases || !("purchases" in root)
				? 0
				: root.purchases.reduce(
						(result, purchase) => result + Purchase.spent(purchase, root.amount[1], { vat: options.vat }),
						0
				  )
		)
	}
	function calculateSpentBalance(root: Delegation | CostCenter, options?: { vat?: boolean }): number {
		return isoly.Currency.subtract(root.amount[1], root.amount[0], spent(root, options))
	}
	export const allocated = Object.assign(calculateAllocated, { balance: calculateAllocatedBalance })
	function calculateAllocated(root: Delegation | CostCenter): number {
		return (
			("purchases" in root
				? root.purchases.reduce(
						(result, purchase) => isoly.Currency.add(root.amount[1], result, purchase.payment.limit[0]),
						0
				  )
				: root.costCenters.reduce(
						(result, costCenter) => isoly.Currency.add(root.amount[1], result, costCenter.amount[0]),
						0
				  )) +
			root.delegations.reduce(
				(result, delegation) => isoly.Currency.add(root.amount[1], result, delegation.amount[0]),
				0
			)
		)
	}
	function calculateAllocatedBalance(root: Delegation | CostCenter): number {
		return isoly.Currency.subtract(root.amount[1], root.amount[0], allocated(root))
	}
	export function validate(delegation: Delegation, limit?: Amount): boolean {
		const equity: Amount = [allocated.balance(delegation), delegation.amount[1]]
		return (
			!!delegation.id &&
			delegation.created <= delegation.modified &&
			delegation.modified <= isoly.DateTime.now() &&
			!!delegation.from &&
			!!delegation.costCenter &&
			Delegation.Creatable.validate(delegation, limit) &&
			0 <= equity[0] &&
			(!limit || equity[0] <= limit[0]) &&
			delegation.delegations.every(delegation => Delegation.validate(delegation, [delegation.amount[0], equity[1]]))
		)
	}
}
