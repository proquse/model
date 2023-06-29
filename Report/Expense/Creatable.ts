import { isly } from "isly"
import type { CostCenter } from "../../CostCenter"
import { Identifier } from "../../CostCenter/Identifier"
import { Email } from "../../Email"

export interface Creatable {
	costCenters: CostCenter["id"][]
	emails?: Email[]
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		costCenters: isly.array(Identifier.type),
		emails: isly.array(Email.type).optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
}
