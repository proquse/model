/**
 * This file is needed to avoid circular dependencies between CostCenter/index.ts and Delegation/index.ts
 * CostCenter imports a lot from delegation and delegation depends on costCenters change function
 */

import type { CostCenter } from "../CostCenter"
import { findCostCenter, findDelegation } from "./find"
import type { Delegation } from "./index"

export function changeDelegation(
	roots: (CostCenter | Delegation)[],
	change: Delegation
): { root: CostCenter | Delegation; changed: Delegation } | undefined {
	const search = findDelegation(roots, change.id)
	let result: { root: CostCenter | Delegation; changed: Delegation } | undefined = !search
		? search
		: "costCenters" in search.found
		? undefined
		: { root: search.root, changed: search.found }

	if (result)
		if ("name" in result.root && result.root.name != change.costCenter)
			result = undefined
		else if (result.root.type == "delegation" && result.root.costCenter != change.costCenter)
			result = undefined
		else
			Object.assign(result.changed, change)
	return result
}
function changeName(root: CostCenter | Delegation, name: string): string {
	if (root.type == "costCenter")
		root.name = name
	else
		root.costCenter = name
	for (const child of root.usage)
		if (child.type == "delegation")
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
	if (result)
		if (result.changed.name != change.name) {
			Object.assign(result.changed, change)
			changeName(result.changed, change.name)
		} else
			Object.assign(result.changed, change)

	return result
}
