import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Cadence } from "../Cadence"
import { CostCenter } from "../CostCenter"

export interface Creatable {
	from: userwidgets.Email
	to: userwidgets.Email[]
	purpose: string
	amount: Cadence
	costCenter: CostCenter["name"]
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: userwidgets.Email.type,
		to: isly.array(userwidgets.Email.type, { criteria: "minLength", value: 1 }),
		purpose: isly.string(/.+/),
		amount: Cadence.type,
		costCenter: isly.string(/.+/),
	})
	export const is = type.is
	export const flaw = type.flaw
}
