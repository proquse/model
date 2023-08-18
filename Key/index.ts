import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"
import { Roles } from "../Roles"
import { Creatable as KeyCreatable } from "./Creatable"

export type Key = userwidgets.User.Key<userwidgets.User.Key.Creatable.Claims, Roles.Permissions.Issuefab>
export namespace Key {
	export type Creatable = KeyCreatable
	export const Creatable = KeyCreatable
	export const type: isly.Type<Key> = userwidgets.User.Key.type.create<
		userwidgets.User.Key.Creatable.Claims,
		Roles.Permissions
	>({
		permissions: Roles.Permissions.type,
	})
	export const is = type.is
	export const flaw = type.flaw
	export type Verifier = userwidgets.User.Key.Verifier<Key>
	export namespace Verifier {
		export function create(...parameters: Parameters<typeof userwidgets.User.Key.Verifier.create>): Verifier {
			return userwidgets.User.Key.Verifier.create<Key>(...parameters)
		}
	}
}
