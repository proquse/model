import { issuefab } from "../index"

describe("Key.Creatable", () => {
	it("is", () => {
		const key: issuefab.Key.Creatable = {
			name: { first: "jessie", last: "doe" },
			email: "jessie@example.com",
			permissions: {
				"*": {
					org: true,
					payment: { expense: true },
					delegation: true,
					app: {
						view: true,
					},
				},
				a1b2c3d4: {
					org: true,
					payment: { expense: true },
					delegation: true,
				},
			},
		}
		expect(issuefab.Key.Creatable.is(key)).toEqual(true)
		expect(issuefab.Key.Creatable.type.get(key)).toEqual(key)
	})
})
