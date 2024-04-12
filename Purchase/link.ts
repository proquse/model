import { isly } from "isly"
import { Receipt } from "../Receipt"
import { Identifier } from "./Identifier"

export interface Link {
	receipt: Receipt.Identifier
	purchase: Identifier
	transaction: { reference: string }
}

export namespace Link {
	export const type = isly.object<Link>({
		receipt: Receipt.Identifier.type,
		purchase: Identifier.type,
		transaction: isly.object<Required<Link>["transaction"]>({
			reference: isly.string(),
		}),
	})
	export const is = type.is
	export const flaw = type.flaw
}
