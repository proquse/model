import { isly } from "isly"
import type { CostCenter } from "../../CostCenter"
import { Identifier } from "../../CostCenter/Identifier"

export interface Creatable {
	costCenters: CostCenter.Identifier[]
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		costCenters: isly.array(Identifier.type),
	})

	export const is = type.is
	export const flaw = type.flaw
}
