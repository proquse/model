import { userwidgets } from "@userwidgets/model"
import { issuefab } from "../index"

describe("Financial Controller", () => {
	it("satisfies", () => {
		const key: userwidgets.User.Key = {
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
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
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
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions, "")).toEqual(false)
		key.permissions = {
			organizationId: {
				user: { invite: true, view: true },
				payment: true,
			},
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions, "")).toEqual(false)
		key.permissions = {
			["*"]: {
				user: { invite: true, view: true },
				payment: true,
			},
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "")).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions, "")).toEqual(true) //why should this one be true?
	})
})
