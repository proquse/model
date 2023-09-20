import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"

export type Creatable = userwidgets.User.Key.Creatable<userwidgets.User.Key.Creatable.Claims, Roles.Permissions.Proquse>
export namespace Creatable {
	export const type: isly.Type<Creatable> =
		userwidgets.User.Key.Creatable.type.create<userwidgets.User.Key.Creatable.Claims>()
	export const is = type.is
	export const flaw = type.flaw
}
