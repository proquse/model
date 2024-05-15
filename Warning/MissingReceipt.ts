import { isly } from "isly"
import { Base } from "./Base"

export interface MissingReceipt extends Base {
	type: "missing-receipt"
}
export namespace MissingReceipt {
	export const type = Base.type.extend<MissingReceipt>({
		type: isly.string("missing-receipt"),
	})
	export const is = type.is
	export const flaw = type.flaw
}
