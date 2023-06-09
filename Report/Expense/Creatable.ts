import { isly } from "isly"

export interface Creatable {
	costCenterIds: string[]
	emails?: string[]
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		costCenterIds: isly.array(isly.string()),
		emails: isly.array(isly.string()).optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
}
