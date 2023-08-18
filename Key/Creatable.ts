import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Roles } from "../Roles"

export type Creatable = userwidgets.User.Key.Creatable<
	userwidgets.User.Key.Creatable.Claims,
	Roles.Permissions.Issuefab
>
export namespace Creatable {
	export const type: isly.Type<Creatable> = userwidgets.User.Key.Creatable.type.create<
		userwidgets.User.Key.Creatable.Claims,
		Roles.Permissions
	>({
		permissions: Roles.Permissions.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
