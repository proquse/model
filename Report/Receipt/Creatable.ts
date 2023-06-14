import { isly } from "isly"

export interface Creatable {
	costCenterIds: string[]
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		costCenterIds: isly.array(isly.string()),
	})

	export const is = type.is
	export const flaw = type.flaw
}
