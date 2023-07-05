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
	function calculateSpentBalance(root: Delegation | CostCenter, date: isoly.Date, options?: { vat?: boolean }): number {
		return isoly.Currency.subtract(root.amount.currency, Cadence.allocated(root.amount, date), spent(root, options))
	}
	export const allocated = Object.assign(calculateAllocated, { balance: calculateAllocatedBalance })
	function calculateAllocated(root: Delegation | CostCenter, date?: isoly.Date): number {
		const cadenceDate = date ? date : getDate(root.amount)
		return (
			("purchases" in root
				? root.purchases.reduce(
						(result, purchase) =>
							isoly.Currency.add(root.amount.currency, result, Cadence.allocated(purchase.payment.limit, cadenceDate)),
						0
				  )
				: root.costCenters.reduce(
						(result, costCenter) =>
							isoly.Currency.add(root.amount.currency, result, Cadence.allocated(costCenter.amount, cadenceDate)),
						0
				  )) +
			root.delegations.reduce(
				(result, delegation) =>
					isoly.Currency.add(root.amount.currency, result, Cadence.allocated(delegation.amount, cadenceDate)),
				0
			)
		)
	}
	function calculateAllocatedBalance(root: Delegation | CostCenter, date?: isoly.Date): number {
		const cadenceDate = date ? date : getDate(root.amount)
		return isoly.Currency.subtract(
			root.amount.currency,
			Cadence.allocated(root.amount, cadenceDate),
			allocated(root, cadenceDate)
		)
	}
	function getDate(cadence: Cadence) {
		let result: isoly.Date
		switch (cadence.interval) {
			case "year":
				result = isoly.Date.lastOfYear(isoly.Date.now())
				break
			case "month":
				result = isoly.Date.lastOfMonth(isoly.Date.now())
				break
			case "week":
				result = isoly.Date.lastOfWeek(isoly.Date.now())
				break
			case "single":
				result = isoly.Date.now()
				break
		}
		return result
	}
	export function validate(
		delegation: Delegation,
		date: isoly.Date,
		options?: { limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const cadence = Cadence.allocated(delegation.amount, date)
		const balance = isoly.Currency.subtract(
			options?.currency ?? delegation.amount.currency,
			cadence,
			Delegation.allocated(delegation, date)
		)
		return (
			cadence > 0 &&
			balance >= 0 &&
			(!options?.currency || delegation.amount.currency == options.currency) &&
			(options?.limit == undefined || cadence <= options.limit) &&
			delegation.purchases.every(p =>
				Purchase.validate(p, date, { currency: delegation.amount.currency, spent: options?.spent })
			) &&
			delegation.delegations.every(d =>
				Delegation.validate(d, date, { currency: delegation.amount.currency, spent: options?.spent })
			)
		)
	}
}
