import * as isoly from "isoly"
import { Key as UserKey } from "./Key"
import { Name as UserName } from "./Name"

export interface User {
	email: string
	name: UserName
	permissions: Record<string /* app id */, Record<string /* org id & * */, string>>
	modified: isoly.DateTime
}

export namespace User {
	export function is(value: User | any): value is User & Record<string, any> {
		return (
			typeof value == "object" &&
			UserName.is(value.name) &&
			typeof value.permissions == "object" &&
			Object.entries(value.permissions).every(
				([appId, org]) =>
					typeof appId == "string" &&
					typeof org == "object" &&
					org != null &&
					Object.entries(org).every(
						([orgId, permissions]) => typeof orgId == "string" && typeof permissions == "string"
					)
			) &&
			isoly.DateTime.is(value.modified)
		)
	}
	export type Name = UserName
	export const Name = UserName
	export type Key = UserKey
	export namespace Key {
		export const is = UserKey.is
		export const isIssuer = UserKey.isIssuer
		export const unpack = UserKey.unpack
		export type Verifier = UserKey.Verifier
		export namespace Unsigned {
			export const Verifier = UserKey.Unsigned.Verifier
		}
		export namespace Signed {
			export const Verifier = UserKey.Signed.Verifier
		}
	}
}
