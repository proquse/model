import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { isly } from "isly"
import type { CostCenter } from "../CostCenter"
import type { Delegation } from "../Delegation"
import type { Purchase } from "../Purchase"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Identifier as ReceiptIdentifier } from "./Identifier"
import { Total as ReceiptTotal } from "./Total"
export interface Receipt extends Omit<Receipt.Creatable, "file"> {
	id: Receipt.Identifier
	original: string
	date: isoly.DateTime
}

export namespace Receipt {
	export type Identifier = ReceiptIdentifier
	export const Identifier = ReceiptIdentifier
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
	// maybe expand on this to shorten purchase validate
	export function validate(receipt: Receipt, currency: isoly.Currency): boolean {
		return receipt.total.every(total => Total.validate(total, currency))
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
	export type Creatable = ReceiptCreatable
	export const Creatable = ReceiptCreatable
	export type Total = ReceiptTotal
	export const Total = ReceiptTotal
}
