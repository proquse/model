import { Amount } from "../../Amount"
import { Creatable as ExpenseCreatable } from "./Creatable"

export interface Expense {
	type: "expense"
	limit: Amount
}

export namespace Expense {
	export function is(value: Expense | any): value is Expense {
		return value == "object" && value && value.type == "expense" && Amount.is(value.limit)
	}
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
}
