import * as model from "../../../index"

describe("Payment.Card.Token", () => {
	const a: model.Payment.Card.Token = {
		value: "someCardToken",
		supplier: "someSupplier",
	}
	it("is", () => {
		expect(model.Payment.Card.Token.is(a)).toEqual(true)
	})
})
