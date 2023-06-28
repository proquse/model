import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Delegation } from "../Delegation"
import { changeCostCenter } from "../Delegation/change"
import { findCostCenter, findNode } from "../Delegation/find"
import { Creatable as CostCenterCreatable } from "./Creatable"

export interface CostCenter extends CostCenter.Creatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	delegations: Delegation[]
	costCenters: CostCenter[]
}
export namespace CostCenter {
	const idLength = 8
	export type Creatable = CostCenterCreatable
	export const Creatable = CostCenterCreatable
	export const type: isly.object.ExtendableType<CostCenter> = Creatable.type.extend<CostCenter>({
		id: isly.fromIs<cryptly.Identifier>("Identifier", value => cryptly.Identifier.is(value, idLength)),
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
			id: override?.id ?? cryptly.Identifier.generate(idLength),
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
	export function validate(costCenter: CostCenter, date: isoly.Date, limit?: Cadence): boolean {
		const equity = allocated.balance(costCenter, date)
		return (
			!!costCenter.id &&
			costCenter.created <= costCenter.modified &&
			costCenter.modified <= isoly.DateTime.now() &&
			!!costCenter.from &&
			!!costCenter.name &&
			0 <= equity &&
			(!limit || (costCenter.amount.currency == limit.currency && equity <= Cadence.allocated(limit, date))) &&
			costCenter.delegations.every(d =>
				Delegation.validate(d, date, { ...d.amount, currency: costCenter.amount.currency })
			) &&
			costCenter.costCenters.every(c => validate(c, date, { ...c.amount, currency: costCenter.amount.currency }))
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
