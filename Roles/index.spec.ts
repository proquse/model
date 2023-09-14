import { userwidgets } from "@userwidgets/model"
import { proquse } from "../index"

describe("Financial Controller", () => {
	it("satisfies", () => {
		const key: userwidgets.User.Key<userwidgets.User.Key.Creatable.Claims, proquse.Roles.Permissions.Proquse> = {
			issuer: "",
			audience: "",
			issued: "",
			expires: "",
			token: "",
			name: { first: "", last: "" },
			email: "",
			permissions: {
				organizationId: {
					org: { view: true, edit: true },
					user: { invite: true, view: true, admin: true },
					delegation: { create: true, read: true, edit: true, view: true },
					costCenter: { root: true, child: { create: true, read: true, edit: true, view: true } },
					purchase: true,
					banking: true,
					payment: true,
					reports: true,
				},
			},
		}
		expect(proquse.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("admin", key.permissions)).toEqual(false)
		key.permissions = {
			["*"]: {
				org: { edit: true },
			},
			organizationId: {
				org: { view: true },
				user: { invite: true, view: true, admin: true },
				delegation: { create: true, read: true, edit: true, view: true },
				costCenter: { root: true, child: { create: true, read: true, edit: true, view: true } },
				purchase: true,
				banking: true,
				payment: true,
				reports: true,
			},
		}
		expect(proquse.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(proquse.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("user", key.permissions, "")).toEqual(false)
		expect(proquse.Roles.satisfies("admin", key.permissions)).toEqual(false)
		key.permissions = {
			organizationId: {
				user: { invite: true, view: true },
				payment: true,
			},
		}
		expect(proquse.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(proquse.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(proquse.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("user", key.permissions, "")).toEqual(false)
		key.permissions = {
			["*"]: {
				user: { invite: true, view: true },
				payment: true,
			},
		}
		expect(proquse.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(proquse.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(proquse.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("user", key.permissions, "")).toEqual(true)
		key.permissions = {
			"*": {
				org: { view: true, edit: true, create: true },
				user: { invite: true, view: true, admin: true },
				delegation: { create: true, read: true, edit: true, view: true },
				costCenter: { root: true, child: { create: true, read: true, edit: true, view: true } },
				purchase: true,
				banking: true,
				payment: true,
				reports: true,
				app: true,
			},
			whatever: { org: {} },
		}
		expect(proquse.Roles.satisfies("admin", key.permissions)).toEqual(true)
		expect(proquse.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(proquse.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
	})
})
