/**
 * This file is needed due to the circular dependency issue between CostCenter/index.ts and Delegation/index.ts
 * this file is needed to help solve the issue explained in ./change.ts
 */

import { cryptly } from "cryptly"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "./index"

// add test for this one
export function findNode<T extends Delegation | CostCenter>(
	roots: T[],
	id: string
): { root: T; found: Delegation | CostCenter } | undefined {
	const search = roots.find(root => root.id == id)
	let result: { root: T; found: Delegation | CostCenter } | undefined = search
		? { root: search, found: search }
		: undefined
	return (
		result ??
		(roots.find(
			root =>
				(result = (result => (!result ? result : { ...result, root }))(
					findNode(root.delegations, id) ?? ("costCenters" in root ? findNode(root.costCenters, id) : undefined)
				))
		) &&
			result)
	)
}

export function findDelegation<T extends Delegation | CostCenter>(
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
					findDelegation(root.delegations, id) ??
						("costCenters" in root ? findDelegation(root.costCenters, id) : undefined)
				))
		) &&
			result)
	)
}
export function findCostCenter(
	roots: CostCenter[],
	id: cryptly.Identifier
): { root: CostCenter; found: CostCenter } | undefined {
	const search = roots.find(root => root.id == id)
	let result: { root: CostCenter; found: CostCenter } | undefined = search && { root: search, found: search }
	return (
		result ??
		(roots.find(
			root => (result = (result => (!result ? result : { ...result, root }))(findCostCenter(root.costCenters, id)))
		) &&
			result)
	)
}
// export const find = Object.assign(findNode, { delegation: findDelegation, costCenter: findCostCenter })
