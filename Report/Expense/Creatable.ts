import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import type { CostCenter } from "../../CostCenter"
import { Identifier } from "../../CostCenter/Identifier"

export interface Creatable {
	costCenters: CostCenter["id"][]
	emails?: userwidgets.Email[]
}

export namespace Creatable {
	export const type = isly.object<Creatable>({
		costCenters: isly.array(Identifier.type),
		emails: isly.array(userwidgets.Email.type).optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
}
