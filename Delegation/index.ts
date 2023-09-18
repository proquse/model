import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { CostCenter } from "../CostCenter"
import { Purchase } from "../Purchase"
import { changeDelegation } from "./change"
import { Creatable as DelegationCreatable } from "./Creatable"
import { findDelegation, findNode } from "./find"
import { Identifier as DelegationIdentifier } from "./Identifier"

export interface Delegation extends Delegation.Creatable {
	id: Delegation.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	purchases: Purchase[]
	delegations: Delegation[]
}
export namespace Delegation {
	export type Identifier = DelegationIdentifier
	export const Identifier = DelegationIdentifier
	export type Creatable = DelegationCreatable
	export const Creatable = DelegationCreatable
	export const type: isly.object.ExtendableType<Delegation> = Creatable.type.extend<Delegation>({
		id: Identifier.type,
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		purchases: isly.array(isly.fromIs("Purchase", Purchase.is)),
		delegations: isly.array(isly.lazy(() => type, "Delegation")),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function create(delegation: Delegation.Creatable, override?: Partial<Delegation>): Delegation {
		const now = isoly.DateTime.now()
		return {
			...delegation,
			...override,
			id: override?.id ?? cryptly.Identifier.generate(Identifier.length),
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
	export function findUser<T extends Delegation | CostCenter>(roots: T[], email: userwidgets.Email): Delegation[] {
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
		TResult extends T extends Delegation ? Delegation : CostCenter | Delegation
	>(nodes: T[], id: string, path: TResult[] = []): TResult[] | undefined {
		const found = nodes.find(root => root.id == id) as TResult | undefined
		let result: TResult[] | undefined
		if (found)
			result = [...path, found]
		else if (nodes.length)
			for (const node of nodes) {
				const nodes = "costCenters" in node ? [...node.costCenters, ...node.delegations] : node.delegations
				result = Delegation.path(nodes as T[], id, [...path, node] as TResult[])
				if (result)
					break
			}
		else
			result = undefined
		return result
	}
	function sustainablePath<T extends Delegation | CostCenter>(
		path: T[],
		options?: { date?: isoly.Date; limit?: number }
	): void {
		const node = path.at(0)
		const nodes = path.slice(1)
		if (node) {
			const date = options?.date ?? isoly.Date.now()
			const allocated = Cadence.allocated(node.amount, date, { limit: options?.limit })
			const children = ("costCenters" in node ? [...node.delegations, ...node.costCenters] : node.delegations).map(
				node => node.amount
			)
			const sustainable = isoly.Date.next(
				node.amount.created,
				Cadence.sustainable(node.amount, children, date, { limit: allocated })
			)
			if (nodes.length)
				sustainablePath(nodes, { date: sustainable })
			else
				node.amount.sustainable = sustainable
		}
	}
	export function sustainable<T extends Delegation | CostCenter>(
		ancestors: CostCenter[],
		descendants: T[],
		options?: { date: isoly.Date }
	): T[] {
		const paths = descendants
			.map(descendant => path(ancestors, descendant.id)?.slice(1).concat(descendant)) // splice in the descendant into the new path. they might be diffrent objects? only mutate descendants
			.filter((descendant: CostCenter[] | undefined): descendant is CostCenter[] => !!descendant)
		paths.forEach(path => sustainablePath(path, options))
		return descendants
	}
	export const spent = Object.assign(calculateSpent, { balance: calculateSpentBalance })
	function calculateSpent(root: Delegation | CostCenter, options?: { vat?: boolean }): number {
		return [...root.delegations, ...("costCenters" in root ? root.costCenters : [])].reduce(
			(result, current) => result + spent(current, { ...options }),
			!("purchases" in root)
				? 0
				: root.purchases.reduce(
						(result, purchase) =>
							isoly.Currency.add(root.amount.currency, result, Purchase.spent(purchase, { vat: options?.vat })),
						0
				  )
		)
	}
	function calculateSpentBalance(root: Delegation | CostCenter, date: isoly.Date, options?: { vat?: boolean }): number
	function calculateSpentBalance(root: Delegation | CostCenter, allocated: number, options?: { vat?: boolean }): number
	function calculateSpentBalance(
		root: Delegation | CostCenter,
		allocated: isoly.Date | number,
		options?: { vat?: boolean }
	): number {
		allocated = typeof allocated == "number" ? allocated : Cadence.allocated(root.amount, allocated)
		return isoly.Currency.subtract(root.amount.currency, allocated, spent(root, options))
	}
	export const allocated = Object.assign(calculateAllocated, { balance: calculateAllocatedBalance })
	function calculateAllocated(root: Delegation | CostCenter, date: isoly.Date): number {
		return (
			("purchases" in root
				? root.purchases.reduce(
						(result, purchase) =>
							isoly.Currency.add(root.amount.currency, result, Cadence.allocated(purchase.payment.limit, date)),
						0
				  )
				: root.costCenters.reduce(
						(result, costCenter) =>
							isoly.Currency.add(root.amount.currency, result, Cadence.allocated(costCenter.amount, date)),
						0
				  )) +
			root.delegations.reduce(
				(result, delegation) =>
					isoly.Currency.add(root.amount.currency, result, Cadence.allocated(delegation.amount, date)),
				0
			)
		)
	}
	function calculateAllocatedBalance(root: Delegation | CostCenter, date: isoly.Date): number {
		return isoly.Currency.subtract(root.amount.currency, Cadence.allocated(root.amount, date), allocated(root, date))
	}
	export function validate(
		delegation: Delegation,
		options?: { date?: isoly.Date; limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const date = options?.date ?? isoly.Date.now()
		const allocated = Cadence.allocated(delegation.amount, date, { limit: options?.limit })
		const sustainable = isoly.Date.next(
			delegation.amount.created,
			Cadence.sustainable(
				delegation.amount,
				delegation.delegations.map(d => d.amount).concat(delegation.purchases.map(p => p.payment.limit)),
				date,
				{ limit: allocated }
			)
		)
		return (
			allocated > 0 &&
			(!options?.limit || allocated <= options.limit) &&
			isoly.DateTime.getDate(delegation.created) <= delegation.amount.created &&
			delegation.amount.created <= sustainable &&
			(!options?.currency || delegation.amount.currency == options.currency) &&
			delegation.delegations.every(
				d =>
					delegation.created <= d.created &&
					Delegation.validate(d, { date: sustainable, currency: delegation.amount.currency, spent: options?.spent })
			) &&
			delegation.purchases.every(
				p =>
					delegation.created <= p.created &&
					Purchase.validate(p, { date: sustainable, currency: delegation.amount.currency, spent: options?.spent })
			)
		)
	}
}
