import { isoly } from "isoly"
import { isly } from "isly"
import { Amount } from "../../Amount"
import { Status as OperationStatus } from "./Status"
import { Type as OperationType } from "./Type"

export interface Operation {
	type: Operation.Type
	reference: string
	amount: { account: Amount; merchant: Amount; rate: number }
	status: Operation.Status
	modified: isoly.DateTime
	created: isoly.DateTime
}
export namespace Operation {
	export import Type = OperationType
	export import Status = OperationStatus
	export const type = isly.object<Operation>({
		type: Type.type,
		reference: isly.string(),
		amount: isly.object({ account: Amount.type, merchant: Amount.type, rate: isly.number() }),
		status: Status.type,
		modified: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
		created: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
	})
	export const is = type.is
	export const flaw = type.flaw
}
