import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Delegation } from "../Delegation"
import { changeCostCenter } from "../Delegation/change"
import { findCostCenter, findNode } from "../Delegation/find"
import { Creatable as CostCenterCreatable } from "./Creatable"
import { Identifier as CostCenterIdentifier } from "./Identifier"

export interface CostCenter extends CostCenter.Creatable {
	id: CostCenter.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	delegations: Delegation[]
	costCenters: CostCenter[]
}
export namespace CostCenter {
	export type Identifier = CostCenterIdentifier
	export const Identifier = CostCenterIdentifier
	export type Creatable = CostCenterCreatable
	export const Creatable = CostCenterCreatable
	export const type: isly.object.ExtendableType<CostCenter> = Creatable.type.extend<CostCenter>({
		id: Identifier.type,
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		delegations: isly.array(Delegation.type),
		costCenters: isly.array(isly.lazy(() => type, "CostCenter")),
	})
	export const is = type.is
	export const flaw = type.flaw

	export function create(costCenter: CostCenter.Creatable, override?: Partial<CostCenter>): CostCenter {
		const now = isoly.DateTime.now()
		return {
			...costCenter,
			...override,
			id: override?.id ?? cryptly.Identifier.generate(Identifier.length),
			created: override?.created ?? now,
			modified: override?.modified ?? now,
			delegations: override?.delegations ?? [],
			costCenters: override?.costCenters ?? [],
		}
	}
	export const change = changeCostCenter
	export function remove(roots: CostCenter[], id: string): { root: CostCenter; removed: CostCenter } | undefined {
		let result: ReturnType<typeof remove>
		const index = roots.findIndex(root => root.id == id && (result = { root: root, removed: root }))
		if (index >= 0)
			roots.splice(index, 1)
		return result
			? result
			: roots.find(
					root => (result = (result => (!result ? result : { ...result, root }))(remove(root.costCenters, id)))
			  ) && result
	}
	// validation must chest that all children occurs after created date
	export function validate(
		costCenter: CostCenter,
		options?: { date?: isoly.Date; limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const date = isoly.Date.next(
			isoly.DateTime.getDate(costCenter.created),
			Cadence.sustainable(
				costCenter.amount,
				costCenter.costCenters.map(c => c.amount).concat(costCenter.delegations.map(d => d.amount)),
				options?.date ?? isoly.Date.now(),
				{ limit: options?.limit }
			)
		)
		const cadence = Cadence.allocated(costCenter.amount, date)
		const balance = Delegation.allocated.balance(costCenter, date)
		const created = isoly.DateTime.getDate(costCenter.created)
		return (
			cadence > 0 &&
			(!options?.limit || cadence <= options.limit) &&
			balance >= 0 &&
			created <= date &&
			created <= costCenter.amount.created &&
			(!options?.currency || costCenter.amount.currency == options.currency) &&
			costCenter.costCenters.every(
				c =>
					costCenter.created <= c.created &&
					CostCenter.validate(c, { date, currency: costCenter.amount.currency, spent: options?.spent })
			) &&
			costCenter.delegations.every(
				d =>
					costCenter.created <= d.created &&
					Delegation.validate(d, { date, currency: costCenter.amount.currency, spent: options?.spent })
			)
		)
	}
	export const find = Object.assign(findCostCenter, { node: findNode })
	export const findUser = Delegation.findUser
	export const findParent = Delegation.findParent
	export const findParents = Delegation.findParents
	export const path = Delegation.path
	export const spent = Delegation.spent
	export const allocated = Delegation.allocated
}
