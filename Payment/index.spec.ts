import * as model from "../index"

describe("Payment", () => {
	const payment: model.Payment = {
		type: "card",
		limit: [10, "EUR"],
		card: "4200000000/2202/aoeuhatns",
	}
	it("is", () => {
		expect(model.Payment.is(payment)).toEqual(true)
	})
})
