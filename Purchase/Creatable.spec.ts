import { issuefab } from "../index"

describe("Purchase.Creatable", () => {
	const creatable: issuefab.Purchase.Creatable = {
		purpose: "buy things",
		payment: {
			type: "expense",
			limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		},
		buyer: "jane@example.com",
	}
	it("is", () => {
		expect(issuefab.Purchase.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Purchase.Creatable.is((({ payment, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
})
