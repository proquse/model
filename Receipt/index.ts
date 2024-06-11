import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import type { Purchase } from "../Purchase"
import { Validation as ReceiptValidation } from "../Validation"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Identifier as ReceiptIdentifier } from "./Identifier"
import { Total as ReceiptTotal } from "./Total"

export interface Receipt extends Omit<Receipt.Creatable, "file"> {
	id: Receipt.Identifier
	original: string
	date: isoly.DateTime
}

export namespace Receipt {
	export import Identifier = ReceiptIdentifier
	export import Creatable = ReceiptCreatable
	export import Total = ReceiptTotal
	export type Validation = ReceiptValidation<Receipt>
	export const type = isly.object<Receipt>({
		id: Identifier.type,
		original: isly.string(/^http.+$/),
		total: isly.array(ReceiptTotal.type),
		date: isly.fromIs("DateTime", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function create(receipt: Creatable, purchase: string, origin: string, override?: Partial<Receipt>): Receipt {
		const id = cryptly.Identifier.generate(Identifier.length)
		return {
			...(({ file, ...receipt }) => receipt)(receipt),
			...override,
			id: override?.id ?? id,
			original: override?.original ?? `${origin}/receipt/${purchase}/${id}`,
			date: override?.date ?? isoly.DateTime.now(),
		}
	}

	export function find<T extends Delegation | CostCenter>(
		roots: T[],
		id: string
	): { root: T; delegation: Delegation; purchase: Purchase; found: Receipt } | undefined {
		let result: { root: T; delegation: Delegation; purchase: Purchase; found: Receipt } | undefined
		roots.find(
			root =>
				root.type == "delegation" &&
				root.usage.find(
					purchase =>
						purchase.type == "purchase" &&
						purchase.receipts.find(
							receipt =>
								receipt.id == id &&
								(result = { root, delegation: root as Delegation, purchase: purchase, found: receipt })
						)
				)
		) ??
			roots.find(root => {
				const notPurchase = root.usage.reduce<(CostCenter | Delegation)[]>(
					(result, node) => result.concat(node.type != "purchase" ? node : []),
					[]
				)
				result = (result => (!result ? result : { ...result, root }))(find(notPurchase, id))
				return result
			})
		return result
	}
	export function list<T = Receipt>(
		roots: (CostCenter | Delegation)[],
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list(roots: (CostCenter | Delegation | Purchase)[], delegation?: Delegation): Generator<T> {
			for (const root of roots)
				if (root.type == "costCenter")
					yield* list(root.usage)
				else if (root.type == "purchase") {
					if (delegation)
						for (const receipt of root.receipts)
							if (!filter || filter(receipt, root, delegation))
								yield map ? map(receipt, root, delegation) : (receipt as T)
				} else
					for (const usage of root.usage)
						if (usage.type == "delegation")
							yield* list(usage.usage, usage)
						else if (usage.type == "purchase")
							for (const receipt of usage.receipts)
								if (!filter || filter(receipt, usage, root))
									yield map ? map(receipt, usage, root) : (receipt as T)
		}
		return Array.from(list(roots))
	}

	export function validate(receipt: Receipt, currency: isoly.Currency): Validation {
		let result: Return<typeof validate> | undefined
		if (!receipt.total.length)
			result = { status: false, reason: "amount", origin: receipt }
		else
			for (const total of receipt.total) {
				const validated = Total.validate(total, currency)
				if (validated.status == false) {
					result = { ...validated, origin: receipt }
					break
				}
			}
		return result ?? { status: true }
	}
	export function remove<T extends CostCenter | Delegation>(
		roots: T[],
		id: string
	): { root: T; delegation: Delegation; purchase: Purchase; removed: Receipt } | undefined {
		let result: { root: T; delegation: Delegation; purchase: Purchase; removed: Receipt } | undefined
		const search = find(roots, id)
		const index = search?.purchase.receipts.findIndex(receipt => receipt.id == id) ?? -1
		if (!search || index < 0)
			result = undefined
		else {
			for (const transaction of search.purchase.transactions)
				for (let index = transaction.receipts.length - 1; index >= 0; index--)
					transaction.receipts[index] == id && transaction.receipts.splice(index, 1)
			result = search.purchase.receipts.splice(index, 1) && {
				root: search.root,
				delegation: search.delegation,
				purchase: search.purchase,
				removed: search.found,
			}
		}
		return result
	}
	export function spent(receipt: Receipt, currency: isoly.Currency, options?: { vat?: boolean }): number {
		return receipt.total.reduce(
			(result, { net, vat }) =>
				isoly.Currency.add(
					currency,
					result,
					isoly.Currency.add(currency, net.value, options?.vat != false ? vat.value : 0)
				),
			0
		)
	}
}
