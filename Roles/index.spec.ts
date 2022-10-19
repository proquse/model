import * as userModel from "@userwidgets/model"
import * as model from "../index"

describe("Financial Controller", () => {
	const key: userModel.User.Key = {
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
	it("satisfies", () => {
		expect(model.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
	})
	it("satisfies", () => {
		expect(model.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
	})
})

describe("Financial Controller with App permissions", () => {
	const key: userModel.User.Key = {
		issuer: "",
		audience: "",
		issued: "",
		expires: "",
		token: "",
		name: { first: "", last: "" },
		email: "",
		permissions: {
			["*"]: {
				organization: { read: true },
			},
			organizationId: {
				organization: { write: true },
				user: { read: true, write: true },
				delegation: { read: true, write: true },
				banking: { read: true, write: true },
			},
		},
	}
	it("satisfies", () => {
		expect(model.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(true)
	})
	it("satisfies", () => {
		expect(model.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
	})
})

describe("user", () => {
	const key: userModel.User.Key = {
		issuer: "",
		audience: "",
		issued: "",
		expires: "",
		token: "",
		name: { first: "", last: "" },
		email: "",
		permissions: {
			organizationId: {
				organization: { read: false, write: false },
				user: { read: false, write: true },
				delegation: { read: false, write: false },
				banking: { read: false, write: false },
			},
		},
	}
	it("satisfies", () => {
		expect(model.Roles.satisfies("financialController", key.permissions, "organizationId")).toEqual(false)
	})
	it("satisfies", () => {
		expect(model.Roles.satisfies("user", key.permissions, "organizationId")).toEqual(true)
	})
})
