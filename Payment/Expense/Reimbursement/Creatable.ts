import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"

export interface Creatable {
	issuer: userwidgets.Email
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		issuer: userwidgets.Email.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
