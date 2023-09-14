import { proquse } from "../index"

describe("Purchase.Creatable", () => {
	const creatable: proquse.Purchase.Creatable = {
		purpose: "buy things",
		payment: {
			type: "expense",
			limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		},
		buyer: "jane@example.com",
	}
	it("is", () => {
		expect(proquse.Purchase.Creatable.is(creatable)).toEqual(true)
		expect(proquse.Purchase.Creatable.is((({ payment, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
})
