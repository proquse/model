import { isly } from "isly"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Paid as ExpensePaid } from "./Paid"

export interface Expense extends ExpenseCreatable {
	Paid?: Expense.Paid
}

export namespace Expense {
	export const type: isly.object.ExtendableType<Expense> = ExpenseCreatable.type.extend<Expense>({
		Paid: ExpensePaid.type.optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Paid = ExpensePaid
	export const Paid = ExpensePaid
	export namespace Paid {
		export type Creatable = ExpensePaid.Creatable
	}
}
