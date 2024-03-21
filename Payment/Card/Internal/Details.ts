import { isly } from "isly"

export interface Details {
	csc: string
	pan: string
	holder: string
	expire: {
		year: string
		month: string
	}
}
export namespace Details {
	export const type = isly.object<Details>({
		csc: isly.string(/^\d\d\d$/),
		pan: isly.string(/\d{16}/),
		holder: isly.string(/.+/),
		expire: isly.object({ year: isly.string(/^\d\d$/), month: isly.string(/^(0[1-9]|1[012])$/) }),
	})

	export const is = type.is
	export const flaw = type.flaw
}
