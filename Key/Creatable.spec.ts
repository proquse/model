import { proquse } from "../index"

describe("Key.Creatable", () => {
	it("is", () => {
		const key: proquse.Key.Creatable = {
			name: { first: "jessie", last: "doe" },
			email: "jessie@example.com",
			permissions:
				"*.org *.payment.expense *.delegation *.app.view a1b2c3d4.org a1b2c3d4.payment.expense a1b2c3d4-delegation",
		}
		expect(proquse.Key.Creatable.is(key)).toEqual(true)
		expect(proquse.Key.is((({ name, ...key }) => key)(key))).toEqual(false)
		expect(proquse.Key.Creatable.type.get(key)).toEqual(key)
		expect(proquse.Key.type.get((({ name, ...key }) => key)(key))).toEqual(undefined)
	})
})
