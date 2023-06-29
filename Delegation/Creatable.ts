import { isly } from "isly"
import { Cadence } from "../Cadence"
import { Email } from "../Email"

export interface Creatable {
	from: Email
	to: Email[]
	purpose: string
	amount: Cadence
	costCenter: string
}
export namespace Creatable {
	export const type = isly.object<Creatable>({
		from: Email.type,
		to: isly.array(Email.type, { criteria: "minLength", value: 1 }),
		purpose: isly.string(/.+/),
		amount: Cadence.type,
		costCenter: isly.string(),
	})
	export const is = type.is
	export const flaw = type.flaw
	// fix this if it is used, remove before PR
	// export function equals(first: Creatable | any, second: Creatable | any) {
	// 	return (
	// 		is(first) &&
	// 		is(second) &&
	// 		first.costCenter == second.costCenter &&
	// 		first.purpose == second.purpose &&
	// 		first.amount.every((value, index) => value == second.amount[index]) &&
	// 		first.to.length == second.to.length &&
	// 		first.to.every((value, index) => value == second.to[index])
	// 	)
	// }
	// move empty string validation to isly
}
