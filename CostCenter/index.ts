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
	usage: (Delegation | CostCenter)[]
	type: "costCenter"
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
		usage: isly.array(
			isly.union(
				Delegation.type,
				isly.lazy(() => type, "costCenter")
			)
		),
		type: isly.string("costCenter"),
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
			usage: override?.usage ?? [],
			type: "costCenter",
		}
	}
	export const change = changeCostCenter
	export function remove(
		//remove function does not work on removing costCenters without a parent
		roots: CostCenter[],
		id: string
	): { root: CostCenter; parent: CostCenter; removed: CostCenter } | undefined {
		let result: ReturnType<typeof remove>
		const search = find(roots, id)

		if (search?.parent == undefined)
			result = undefined
		else {
			const index = search.parent.usage.findIndex(costCenter => costCenter == search.found) ?? -1
			result =
				index < 0
					? undefined
					: search.parent.usage.splice(index, 1) && {
							root: search.root,
							parent: search.parent,
							removed: search.found,
					  }
		}
		return result
		// if (index >= 0)
		// 	roots.splice(index, 1)
		// return result
		// 	? result
		// 	: roots.find(
		// 			root =>
		// 				(result = (result => (!result ? result : { ...result, root }))(
		// 					remove(
		// 						root.usage.filter((action): action is CostCenter => CostCenter.is(action)), //NOT SAFE
		// 						id
		// 					)
		// 				))
		// 	  ) && result
	}
	export function validate(
		costCenter: CostCenter,
		options?: { date?: isoly.Date; limit?: number; spent?: boolean; currency?: isoly.Currency }
	): boolean {
		const date = options?.date ?? isoly.Date.now()
		const allocated = Cadence.allocated(costCenter.amount, date, { limit: options?.limit })
		const sustainable = isoly.Date.next(
			costCenter.amount.created,
			Cadence.sustainable(
				costCenter.amount,
				costCenter.usage.map(use => use.amount),
				date,
				{ limit: allocated }
			)
		)
		return (
			allocated > 0 &&
			(!options?.limit || allocated <= options.limit) &&
			isoly.DateTime.getDate(costCenter.created) <= costCenter.amount.created &&
			costCenter.amount.created <= sustainable &&
			(!options?.currency || costCenter.amount.currency == options.currency) &&
			costCenter.usage.every(action =>
				costCenter.created > action.created
					? false //get date?
					: action.type == "costCenter"
					? CostCenter.validate(action, {
							date: sustainable,
							currency: costCenter.amount.currency,
							spent: options?.spent,
					  })
					: Delegation.validate(action, {
							date: sustainable,
							currency: costCenter.amount.currency,
							spent: options?.spent,
					  })
			)
			// costCenter.usage.every(
			// 	c =>
			// 		costCenter.created <= c.created &&
			// 		CostCenter.validate(c, { date: sustainable, currency: costCenter.amount.currency, spent: options?.spent })
			// ) &&
			// costCenter.usage.every(
			// 	d =>
			// 		costCenter.created <= d.created &&
			// 		Delegation.validate(d, { date: sustainable, currency: costCenter.amount.currency, spent: options?.spent })
			// )
		)
	}
	export const find = Object.assign(findCostCenter, { node: findNode })
	export const findUser = Delegation.findUser
	export const findParent = Delegation.findParent
	export const findParents = Delegation.findParents
	export const path = Delegation.path
	export const spent = Delegation.spent
	export const allocated = Delegation.allocated
	export const sustainable = Delegation.sustainable
}
