import { Creatable as ExpenseCreatable } from "./Creatable"

export type Expense = Expense.Creatable
export namespace Expense {
	export const is = ExpenseCreatable.is
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
}
