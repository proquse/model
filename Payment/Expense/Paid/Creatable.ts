import { isly } from "isly"

export interface Creatable {
	issuer: string
}

export namespace Creatable {
	export const type = isly.object<Creatable>({ issuer: isly.string() })
	export const is = type.is
	export const flaw = type.flaw
}
