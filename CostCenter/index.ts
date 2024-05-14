import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Delegation } from "../Delegation"
import { changeCostCenter } from "../Delegation/change"
import { findCostCenter, findNode, findPath } from "../Delegation/find"
import { Purchase } from "../Purchase"
import { Warning } from "../Warning"
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
	export import Identifier = CostCenterIdentifier
	export import Creatable = CostCenterCreatable

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
	/**
	 * remove function does not work on top level costCenter
	 */
	export function remove(
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
					? false
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
		)
	}
	export const find = Object.assign(findCostCenter, { node: findNode })
	export const findUser = Delegation.findUser
	export const findParent = Delegation.findParent
	export const findParents = Delegation.findParents
	export const path = findPath
	export const spent = Delegation.spent
	export const allocated = Delegation.allocated
	export const sustainable = Delegation.sustainable
	export function warnings(
		costCenter: CostCenter,
		date: isoly.Date,
		onWarning?: (warning: Warning) => Warning
	): Warning.Record {
		const warnings: ReturnType<typeof CostCenter.warnings>[string] = { value: [], child: [] }
		const allocated = Cadence.allocated(costCenter.amount, date)
		const children = costCenter.usage.reduce<Cadence[]>((result, child) => result.concat(child.amount), [])
		const days = Cadence.sustainable(costCenter.amount, children, date, { limit: allocated })
		const sustainable = isoly.Date.next(costCenter.amount.created, days)
		if (sustainable < date)
			warnings.value.push(
				(onWarning ?? (warning => warning))({
					source: costCenter.id,
					type: "overallocation",
					severity: 0,
					days: Math.max(0, days),
					message: `Overallocation in ${days} days.`,
				})
			)
		const callback: Parameter<typeof CostCenter.warnings, 2> = warning => {
			warnings.child.push(warning)
			return onWarning?.(warning) ?? warning
		}
		return costCenter.usage.reduce(
			(result, node) => {
				const children =
					node.type == "costCenter"
						? CostCenter.warnings(node, sustainable, callback)
						: Delegation.warnings(node, sustainable, callback)
				return Object.assign(result, children)
			},
			{ [costCenter.id]: warnings }
		)
	}
}
