import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
	buyer: userwidgets.Email
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		purpose: isly.string(/.+/),
		payment: Payment.Creatable.type,
		buyer: userwidgets.Email.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
