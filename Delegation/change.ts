/**
 * This file is needed to avoid circular dependencies between CostCenter/index.ts and Delegation/index.ts
 * CostCenter imports a lot from delegation and delegation depends on costCenters change function
 */

import type { CostCenter } from "../CostCenter"
import { findCostCenter, findDelegation } from "./find"
import type { Delegation } from "./index"

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
	for (const iterable of iterables)
		yield* iterable
}

export function changeDelegation<T extends Delegation | CostCenter>(
	roots: T[],
	change: Delegation
): { root: T; changed: Delegation } | undefined {
	const search = findDelegation(roots, change.id)
	let result: { root: T; changed: Delegation } | undefined = !search
		? search
		: "costCenters" in search.found
		? undefined
		: {
				root: search.root,
				changed: search.found,
		  }

	if (result) {
		if ("name" in result.root && result.root.name != change.costCenter)
			result = undefined
		else if ("purchases" in result.root && result.root.costCenter != change.costCenter)
			result = undefined
		else
			Object.assign(result.changed, change)
	}
	return result
}
function changeName(root: CostCenter | Delegation, name: string): string {
	if ("name" in root)
		root.name = name
	else
		root.costCenter = name
	for (const child of chain<Delegation | CostCenter>(root.delegations, "costCenters" in root ? root.costCenters : []))
		changeName(child, name)
	return name
}
export function changeCostCenter(
	roots: CostCenter[],
	change: CostCenter
): { root: CostCenter; changed: CostCenter } | undefined {
	const search = findCostCenter(roots, change.id)
	const result: { root: CostCenter; changed: CostCenter } | undefined = !search
		? search
		: { root: search.root, changed: search.found }
	if (result) {
		if (result.root.id == result.changed.id && result.root.name != change.name)
			changeName(result.root, change.name)
		Object.assign(result.changed, change)
	}
	return result
}
