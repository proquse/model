import { Payment } from "../Payment"

export interface Creatable {
	purpose: string
	payment: Payment.Creatable
}
