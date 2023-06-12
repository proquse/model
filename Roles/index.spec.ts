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
					organization: { read: true, write: true },
					user: { read: true, write: true },
					delegation: { read: true, write: true },
					banking: { read: true, write: true },
				},
			},
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		key.permissions = {
			["*"]: {
				organization: { read: true },
			},
			organizationId: {
				organization: { write: true },
				user: { read: true, write: true },
				delegation: { read: true, write: true },
				banking: { read: true, write: true },
			},
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("financialController", key.permissions)).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions)).toEqual(false)
		key.permissions = {
			organizationId: {
				organization: { read: false, write: false },
				user: { read: false, write: true },
				delegation: { read: false, write: false },
				banking: { read: false, write: false },
			},
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(issuefab.Roles.satisfies("financialController", key.permissions)).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions)).toEqual(false)
		key.permissions = {
			["*"]: { user: { write: true } },
		}
		expect(issuefab.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
		expect(issuefab.Roles.satisfies("financialController", key.permissions)).toEqual(false)
		expect(issuefab.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
		expect(issuefab.Roles.satisfies("user", key.permissions)).toEqual(true)
	})
})
