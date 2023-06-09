import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import { Delegation } from "../Delegation"
import { Creatable as CostCenterCreatable } from "./Creatable"

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
	for (const iterable of iterables)
		yield* iterable
}

export interface CostCenter extends CostCenter.Creatable {
	id: cryptly.Identifier
	created: isoly.DateTime
	modified: isoly.DateTime
	from: string
	delegations: Delegation[]
	to: string[] // currently defined for backwards compatibility
	costCenters: CostCenter[] // currently optional for backwards compatibility
}
export namespace CostCenter {
	export type Creatable = CostCenterCreatable
	export const Creatable = CostCenterCreatable
	export const type: isly.object.ExtendableType<CostCenter> = Creatable.type.extend<CostCenter>({
		id: isly.fromIs<cryptly.Identifier>("Identifier", cryptly.Identifier.is),
		created: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		modified: isly.fromIs<isoly.DateTime>("DateTime", isoly.DateTime.is),
		from: isly.string(),
		to: isly.array(isly.string(), { criteria: "length", value: 0 }),
		delegations: isly.array(Delegation.type),
		costCenters: isly.array(isly.lazy(() => type, "CostCenter")),
	})
	export const is = type.is
	export const flaw = type.flaw

	export function create(
		costCenter: CostCenter,
		override: Partial<CostCenter>,
		idLength: cryptly.Identifier.Length = 8
	): CostCenter {
		const now = isoly.DateTime.now()
		return {
			...costCenter,
			...override,
			id: override.id ?? cryptly.Identifier.generate(idLength),
			created: override.created ?? now,
			modified: override.modified ?? now,
			delegations: override.delegations ?? [],
			costCenters: override.costCenters ?? [],
		}
	}
	function changeName(root: CostCenter | Delegation, name: string): string {
		root.costCenter = name
		for (const child of chain<Delegation | CostCenter>(root.delegations, "costCenters" in root ? root.costCenters : []))
			changeName(child, name)
		return name
	}
	// export function change(roots: CostCenter[], updated: CostCenter) {
	// 	const search = find(roots, updated.id)
	// 	const result: { root: CostCenter; changed: CostCenter } | undefined = search && { root: search, found: search }
	// 	return result
	// }
	export function find(
		roots: CostCenter[],
		id: cryptly.Identifier
	): { root: CostCenter; found: CostCenter } | undefined {
		const search = roots.find(root => root.id == id)
		let result: { root: CostCenter; found: CostCenter } | undefined = search && { root: search, found: search }
		return (
			result ??
			(roots.find(
				root => (result = (result => (!result ? result : { ...result, root }))(find(root.costCenters, id)))
			) &&
				result)
		)
	}
	// export const find = Delegation.find
	export const findUser = Delegation.findUser
	export const findParent = Delegation.findParent
	export const findParents = Delegation.findParents
	export const path = Delegation.path
	export const remove = Delegation.remove
	export const spent = Delegation.spent
	export const balance = Delegation.balance
}
