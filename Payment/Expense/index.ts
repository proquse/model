import { Amount } from "../../Amount"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Paid as ExpensePaid } from "./Paid"

export interface Expense {
	type: "expense"
	limit: Amount
	Paid?: Expense.Paid
}

export namespace Expense {
	export function is(value: Expense | any): value is Expense {
		return typeof value == "object" && value && value.type == "expense" && Amount.is(value.limit)
	}
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Paid = ExpensePaid
	export const Paid = ExpensePaid
}
