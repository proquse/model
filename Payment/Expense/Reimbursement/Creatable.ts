import { isly } from "isly"
import { Email } from "../../../Email"

export interface Creatable {
	issuer: Email
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		issuer: Email.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
