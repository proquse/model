/**
 * This file is needed due to the circular dependency issue between CostCenter/index.ts and Delegation/index.ts
 * this file is needed to help solve the issue explained in ./change.ts
 */

import { cryptly } from "cryptly"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "./index"

export function findNode(
	roots: (Delegation | CostCenter)[],
	id: string
): { root: Delegation | CostCenter; found: Delegation | CostCenter } | undefined {
	const search = roots.find(root => root.id == id)
	let result: { root: Delegation | CostCenter; found: Delegation | CostCenter } | undefined = search
		? { root: search, found: search }
		: undefined
	if (!result)
		for (const root of roots) {
			const usage: (CostCenter | Delegation)[] = []
			for (const action of root.usage)
				if (action.type != "purchase")
					usage.push(action)
			result = findNode(usage, id)
			if (result) {
				result = { ...result, root }
				break
			}
		}

	return result
}

export function findDelegation(
	roots: (CostCenter | Delegation)[],
	id: string
): { root: CostCenter | Delegation; found: Delegation } | undefined {
	const search = roots.find(root => root.id == id)
	let result: { root: CostCenter | Delegation; found: Delegation } | undefined =
		search && search.type == "delegation" ? { root: search, found: search } : undefined
	if (!result)
		for (const root of roots) {
			const usage: (CostCenter | Delegation)[] = []
			for (const action of root.usage)
				if (action.type != "purchase")
					usage.push(action)
			result = findDelegation(usage, id)
			if (result) {
				result = { ...result, root }
				break
			}
		}
	return result
}
export function findCostCenter(
	roots: CostCenter[],
	id: cryptly.Identifier
): { root: CostCenter; parent: CostCenter | undefined; found: CostCenter } | undefined {
	let result: { root: CostCenter; parent: CostCenter | undefined; found: CostCenter } | undefined

	for (const root of roots)
		if (root.id == id) {
			result = { root: root, parent: undefined, found: root }
			break
		} else
			for (const node of root.usage)
				if (node.type == "costCenter")
					if (node.id == id) {
						result = { root, parent: root, found: node }
						break
					} else {
						result = findCostCenter([node], id)
						if (result) {
							result = { ...result, root }
							break
						}
					}

	return result
}
