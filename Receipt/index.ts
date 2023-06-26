import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import type { Purchase } from "../Purchase"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Total as ReceiptTotal } from "./Total"
export interface Receipt extends Omit<Receipt.Creatable, "file"> {
	id: cryptly.Identifier
	original: string
	date: isoly.DateTime
}

export namespace Receipt {
	export const type = isly.object<Receipt>({
		id: isly.fromIs("Id", cryptly.Identifier.is),
		original: isly.string(),
		total: isly.array(ReceiptTotal.type),
		date: isly.fromIs("DateTime", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw
	export function create(
		receipt: Creatable,
		purchase: string,
		origin: string,
		override?: Partial<Receipt>,
		idLength: cryptly.Identifier.Length = 8
	): Receipt {
		const id = cryptly.Identifier.generate(idLength)
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
				"purchases" in root &&
				root.purchases.find(purchase =>
					purchase.receipts.find(
						receipt =>
							receipt.id == id &&
							(result = { root, delegation: root as Delegation, purchase: purchase, found: receipt })
					)
				)
		) ??
			roots.find(
				root =>
					(result = (result => (!result ? result : { ...result, root }))(find(root.delegations, id))) ??
					("costCenters" in root &&
						(result = (result => (!result ? result : { ...result, root }))(find(root.costCenters, id))))
			)
		return result
	}
	export function list<T = Receipt, TRoot extends Delegation | CostCenter = Delegation | CostCenter>(
		roots: Iterable<TRoot>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list<TRoot extends Delegation | CostCenter>(roots: Iterable<TRoot>): Generator<T> {
			for (const root of roots) {
				if ("purchases" in root)
					for (const purchase of root.purchases)
						for (const receipt of purchase.receipts)
							(!filter || filter(receipt, purchase, root)) &&
								(yield map ? map(receipt, purchase, root) : (receipt as T))

				yield* list(root.delegations)
				if ("costCenters" in root)
					yield* list(root.costCenters)
			}
		}
		return Array.from(list(roots))
	}
	export function validate(receipt: Receipt, currency?: isoly.Currency): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			(!receipt.total.length || !currency || receipt.total.every(total => Total.validate(total, currency)))
		)
	}
	export type Creatable = ReceiptCreatable
	export const Creatable = ReceiptCreatable
	export type Total = ReceiptTotal
	export const Total = ReceiptTotal
}
