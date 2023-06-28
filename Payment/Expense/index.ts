import { isly } from "isly"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Paid as ExpensePaid } from "./Paid"

export interface Expense extends Expense.Creatable {
	paid?: Record<string, Expense.Paid | undefined>
}

export namespace Expense {
	export const type: isly.object.ExtendableType<Expense> = ExpenseCreatable.type.extend<Expense>({
		paid: isly.record(isly.string(), ExpensePaid.type.optional()).optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Paid = ExpensePaid
	export const Paid = ExpensePaid
	export namespace Paid {
		export type Creatable = ExpensePaid.Creatable
	}
}
