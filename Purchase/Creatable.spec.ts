import { issuefab } from "../index"

describe("Purchase.Creatable", () => {
	const creatable: issuefab.Purchase.Creatable = {
		purpose: "buy things",
		payment: {
			type: "card",
			limit: [10, "EUR"],
		},
		buyer: "jane@example.com",
	}
	it("is", () => {
		expect(issuefab.Purchase.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Purchase.Creatable.is((({ payment, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
	it("validate", () => {
		expect(issuefab.Purchase.Creatable.validate(creatable)).toEqual(true)
		expect(
			issuefab.Purchase.Creatable.validate({
				purpose: "asdas",
				payment: { type: "card", limit: [10, "EUR"] },
				buyer: "",
			})
		).toEqual(false)
		expect(
			issuefab.Purchase.Creatable.validate({
				purpose: "",
				payment: { type: "card", limit: [10, "EUR"] },
				buyer: "sasd",
			})
		).toEqual(true)
		expect(
			issuefab.Purchase.Creatable.validate({
				purpose: "",
				payment: { type: "pre-paid", limit: [10, "EUR"] },
				buyer: "sasd",
			})
		).toEqual(true)
		expect(issuefab.Purchase.Creatable.validate(creatable, [20, "EUR"])).toEqual(true)
		expect(issuefab.Purchase.Creatable.validate(creatable, [5, "EUR"])).toEqual(false)
	})
})
