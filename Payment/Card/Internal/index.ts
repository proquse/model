import { isly } from "isly"
import { Creatable as CardCreatable } from "./Creatable"
import { Details as CardDetails } from "./Details"

export interface Internal extends Internal.Creatable {
	details?: Internal.Details
}
export namespace Internal {
	export import Details = CardDetails
	export import Creatable = CardCreatable
	export const type: isly.object.ExtendableType<Internal> = CardCreatable.type.extend<Internal>({
		details: CardDetails.type.optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
