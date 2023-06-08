import { Delegation } from "../Delegation"
import { Creatable as CostCenterCreatable } from "./Creatable"

export type CostCenter = Delegation
export namespace CostCenter {
	export type Creatable = CostCenterCreatable
	export const Creatable = CostCenterCreatable
	export const is = Delegation.is
	export const create = Delegation.create
	export const findUser = Delegation.findUser
	export const find = Delegation.find
	export const findParent = Delegation.findParent
	export const findParents = Delegation.findParents
	export const path = Delegation.path
	export const change = Delegation.change
	export const remove = Delegation.remove
	export const spent = Delegation.spent
	export const balance = Delegation.balance
	export const validate = Delegation.validate
}
