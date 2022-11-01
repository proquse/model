import * as model from "../index"

describe("Payment", () => {
	const payment: model.Payment = {
		type: "card",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(model.Payment.is(payment)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Payment.validate(payment)).toEqual(true)
		expect(model.Payment.validate(payment, [10, "EUR"])).toEqual(true)
		expect(model.Payment.validate(payment, [9, "EUR"])).toEqual(false)
		expect(model.Payment.validate({ type: "card", limit: [-1, "EUR"] })).toEqual(false)
	})
})
