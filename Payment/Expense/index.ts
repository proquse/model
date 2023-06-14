import { isly } from "isly"
import { Amount } from "../../Amount"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Paid as ExpensePaid } from "./Paid"

export interface Expense {
	type: "expense"
	limit: Amount
	Paid?: Expense.Paid
}

export namespace Expense {
	export const type = isly.object<Expense>({
		type: isly.string(["expense"]),
		limit: Amount.type,
		Paid: ExpensePaid.type.optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Paid = ExpensePaid
	export const Paid = ExpensePaid
}
