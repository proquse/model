import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import type { CostCenter } from "../CostCenter"
import { Payment } from "../Payment"
import { Purchase } from "../Purchase"
import { changeDelegation } from "./change"
import { Creatable as DelegationCreatable } from "./Creatable"
import { findDelegation, findNode, findPath } from "./find"
import { Identifier as DelegationIdentifier } from "./Identifier"

export interface Delegation extends Delegation.Creatable {
	id: Delegation.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	usage: (Purchase | Delegation)[]
	type: "delegation"
}
export namespace Delegation {
	export import Identifier = DelegationIdentifier
	export import Creatable = DelegationCreatable
	export const type: isly.object.ExtendableType<Delegation> = Creatable.type.extend<Delegation>({
		id: Identifier.type,
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		usage: isly.array(
			isly.union(
				Purchase.type,
				isly.lazy(() => type, "delegation")
			)
		),
		type: isly.string("delegation"),
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
			usage: override?.usage ?? [],
			type: "delegation",
		}
	}
	export const change = changeDelegation
	export function remove(
		roots: (CostCenter | Delegation)[],
		id: string
	): { root: CostCenter | Delegation; removed: Delegation } | undefined {
		let result: { root: CostCenter | Delegation; removed: Delegation } | undefined
		const index = roots.findIndex(root => root.id == id && root.type == "delegation")
		const found = index == -1 ? undefined : roots[index]

		if (found != undefined && found.type == "delegation")
			result = { root: found, removed: found }

		if (result == undefined)
			for (const root of roots) {
				const usage = root.usage.reduce<(Delegation | CostCenter)[]>(
					(result, node) => result.concat(node.type != "purchase" ? node : []),
					[]
				)
				result = remove(usage, id)
				if (result) {
					const index = root.usage.findIndex(node => node.id == id)
					if (index != -1)
						root.usage.splice(index, 1)
					result = { ...result, root }
					break
				}
			}
		return result
	}

	export const find = Object.assign(findDelegation, { node: findNode })
	export function findUser(roots: (CostCenter | Delegation)[], email: userwidgets.Email): Delegation[] {
		const result: Delegation[] = []
		for (const root of roots) {
			if (root.type == "costCenter") {
				const costCenters = root.usage.reduce<CostCenter[]>(
					(result, node) => result.concat(node.type == "costCenter" ? node : []),
					[]
				)
				result.push(...findUser(costCenters, email))
			} else if (root.to.includes(email))
				result.push(root)

			const delegations = root.usage.reduce<Delegation[]>(
				(result, node) => result.concat(node.type == "delegation" ? node : []),
				[]
			)
			result.push(...findUser(delegations, email))
		}

		return result
	}

	export function findParent(
		roots: (Delegation | CostCenter)[],
		id: string
	): { root: Delegation | CostCenter; found: Delegation | CostCenter } | undefined {
		let result: { root: Delegation | CostCenter; found: Delegation | CostCenter } | undefined

		for (const root of roots) {
			if (root.usage.find(node => node.id == id))
				result = { root: root, found: root }
			else {
				for (const node of root.usage)
					if (node.type != "purchase") {
						result = findParent([node], id)
						if (result)
							result = { ...result, root }
					}
			}
		}

		return result
	}
	export function findParents<
		T extends Delegation | CostCenter,
		TResult extends T extends Delegation ? Delegation | CostCenter : T
	>(roots: T[], id: string): TResult[] | undefined {
		let result: TResult[] | undefined = roots.find(root => root.id == id) && []
		return result
			? result
			: roots.find(
					root =>
						(result = findParents(root.usage.filter(Delegation.is), id)) &&
						(result = [root as unknown as TResult, ...result])
			  ) && result
	}
	export const path = findPath
	function sustainablePath<T extends Delegation | CostCenter>(
		[node, ...nodes]: T[],
		options?: { date?: isoly.Date; limit?: number }
	): void {
		// typescript does not understand node can be undefined!
		if (node) {
			const date = options?.date ?? isoly.Date.now()
			const allocated = Cadence.allocated(node.amount, date, { limit: options?.limit })
			const children = node.usage.reduce<Cadence[]>(
				(result, node) => result.concat(node.type != "purchase" ? node.amount : []),
				[]
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
		options?: { date?: isoly.Date }
	): T[] {
		descendants
			.map(descendant => path(ancestors, descendant.id)?.slice(1).concat(descendant))
			.forEach(path => !!path && sustainablePath(path, options))
		return descendants
	}
	export const spent = Object.assign(calculateSpent, { balance: calculateSpentBalance })
	function calculateSpent(root: Delegation | CostCenter, options?: { vat?: boolean }): number {
		const result = root.usage.reduce(
			(result, current) =>
				Purchase.is(current)
					? isoly.Currency.add(root.amount.currency, result, Purchase.spent(current, { vat: options?.vat }))
					: result + spent(current, { ...options }),
			0
		)
		return result
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
		return root.usage.reduce(
			(result, current) =>
				current.type == "purchase"
					? isoly.Currency.add(
							root.amount.currency,
							result,
							Cadence.allocated(Payment.exchange(current.payment, root.amount.currency) ?? current.payment.limit, date)
					  )
					: isoly.Currency.add(root.amount.currency, result, Cadence.allocated(current.amount, date)),
			0
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
		const children = delegation.usage.reduce<Cadence[]>(
			(result, child) =>
				result.concat(
					child.type == "delegation" ? child.amount : Payment.exchange(child.payment, delegation.amount.currency) ?? []
				),
			[]
		)
		const sustainable = isoly.Date.next(
			delegation.amount.created,
			Cadence.sustainable(delegation.amount, children, date, { limit: allocated })
		)
		return (
			children.length == delegation.usage.length &&
			allocated > 0 &&
			(!options?.limit || allocated <= options.limit) &&
			isoly.DateTime.getDate(delegation.created) <= delegation.amount.created &&
			delegation.amount.created <= sustainable &&
			(!options?.currency || delegation.amount.currency == options.currency) &&
			delegation.usage.every(value =>
				value.type == "delegation"
					? delegation.created <= value.created &&
					  Delegation.validate(value, {
							date: sustainable,
							currency: delegation.amount.currency,
							spent: options?.spent,
					  })
					: delegation.created <= value.created &&
					  Purchase.validate(value, { date: sustainable, currency: delegation.amount.currency, spent: options?.spent })
			)
		)
	}
}
