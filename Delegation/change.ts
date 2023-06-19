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

export function changeDelegation(
	roots: (Delegation | CostCenter)[],
	change: Delegation
): { root: Delegation | CostCenter; changed: Delegation } | undefined {
	const search = findDelegation(roots, change.id)
	let result: { root: Delegation | CostCenter; changed: Delegation } | undefined = !search
		? search
		: "costCenters" in search.found
		? undefined
		: {
				root: search.root,
				changed: search.found,
		  }

	if (result) {
		if (result.root.costCenter != change.costCenter)
			if (!("costCenters" in result.root))
				result = undefined
			else
				changeCostCenter([result.root], { ...result.root, costCenter: Object.assign(result.changed, change).id })
		else
			Object.assign(result.changed, change)
	}
	return result
}
function changeName(root: CostCenter | Delegation, name: string): string {
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
		if (result.root.costCenter != change.costCenter)
			changeName(result.root, change.costCenter)
		Object.assign(result.changed, change)
	}
	return result
}
