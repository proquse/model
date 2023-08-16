import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Permissions as RolesPermissions } from "./Permissions"

export type Roles = keyof typeof Roles.record

export namespace Roles {
	export type Permissions = RolesPermissions
	export const Permissions = RolesPermissions
	export namespace Permissions {
		export type Issuefab = RolesPermissions.Issuefab
	}
	export const type = isly.union<Roles, "admin", "financialController", "user">(
		isly.string("admin"),
		isly.string("financialController"),
		isly.string("user")
	)
	export const is = type.is
	export const flaw = type.flaw
	export const record = {
		admin: [...Permissions.flags],
		financialController: [...Permissions.Issuefab.flags, ...userwidgets.User.Permissions.Organization.flags], //this might also assign app level permission?
		user: ["user.view", "user.invite", "payment"],
	}
	export const roles = Object.keys(record)
	export function satisfies(role: "admin", permissions: Permissions): boolean
	export function satisfies(role: Exclude<keyof typeof record, "admin">, permissions: Permissions, id: string): boolean
	export function satisfies(role: keyof typeof record, permissions: Permissions, id?: string): boolean {
		return id != undefined
			? userwidgets.User.Permissions.check(permissions, id, ...record[role])
			: role == "admin"
			? userwidgets.User.Permissions.check(permissions, "*", ...record[role])
			: false
	}
}
