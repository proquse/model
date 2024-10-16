import { Creatable as PrePaidCreatable } from "./Creatable"

export type PrePaid = PrePaidCreatable

export namespace PrePaid {
	export const type = PrePaidCreatable.type.extend<PrePaid>({})
	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = PrePaidCreatable
	export const Creatable = PrePaidCreatable
}
