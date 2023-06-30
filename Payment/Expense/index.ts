import { isly } from "isly"
import { Receipt } from "./../../Receipt"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Reimbursement as ExpenseReimbursement } from "./Reimbursement"

export interface Expense extends Expense.Creatable {
	reimbursement?: Record<Receipt["id"], Expense.Reimbursement | undefined>
}

export namespace Expense {
	export const type: isly.object.ExtendableType<Expense> = ExpenseCreatable.type.extend<Expense>({
		reimbursement: isly.record(isly.string(), ExpenseReimbursement.type.optional()).optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
	export const validate = ExpenseCreatable.validate
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Reimbursement = ExpenseReimbursement
	export const Reimbursement = ExpenseReimbursement
	export namespace Reimbursement {
		export type Creatable = ExpenseReimbursement.Creatable
	}
}
