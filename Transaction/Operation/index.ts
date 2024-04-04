import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../../Amount"
import { Status as OperationStatus } from "./Status"
import { Type as OperationType } from "./Type"

export interface Operation {
	created: isoly.DateTime
	type: Operation.Type
	amount: Amount
	status: Operation.Status
}
export namespace Operation {
	export import Type = OperationType
	export import Status = OperationStatus
	export const type = isly.object<Operation>({
		created: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
		type: Type.type,
		amount: Amount.type,
		status: Status.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
