import { isly } from "isly"
import { Creatable as PrePaidCreatable } from "./Creatable"

export type PrePaid = PrePaidCreatable

export namespace PrePaid {
	export const type: isly.object.ExtendableType<PrePaid> = PrePaidCreatable.type.extend<PrePaid>({})
	export const is = type.is
	export const flaw = type.flaw
	export const validate = PrePaidCreatable.validate
	export type Creatable = PrePaidCreatable
	export const Creatable = PrePaidCreatable
}
