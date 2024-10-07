import { isly } from "isly"
import type { Receipt } from "../../Receipt"
import { Identifier } from "../../Receipt/Identifier"
import { Creatable as ExpenseCreatable } from "./Creatable"
import { Reimbursement as ExpenseReimbursement } from "./Reimbursement"

export interface Expense extends Expense.Creatable {
	reimbursement?: Record<Receipt["id"], Expense.Reimbursement | undefined>
}

export namespace Expense {
	export const type = ExpenseCreatable.type.extend<Expense>({
		reimbursement: isly
			.record<Identifier, ExpenseReimbursement | undefined>(Identifier.type, ExpenseReimbursement.type.optional())
			.optional(),
	})

	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
	export type Reimbursement = ExpenseReimbursement
	export const Reimbursement = ExpenseReimbursement
	export namespace Reimbursement {
		export type Creatable = ExpenseReimbursement.Creatable
	}
}
