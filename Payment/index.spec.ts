import * as model from "../index"

describe("Payment", () => {
	const payment: model.Payment = {
		type: "card",
		limit: [10, "EUR"],
		card: "4200000000000000/1015/969/john doe",
	}
	it("is", () => {
		expect(model.Payment.is(payment)).toEqual(true)
	})
	it("create", () => {
		const creatable: model.Payment.Creatable = {
			type: "card",
			limit: [10, "EUR"],
		}
		expect(model.Payment.Creatable.is(creatable))
		expect(model.Payment.is(model.Payment.create(creatable, "0123456789121112/0122/969/Jane Doe"))).toEqual(true)
	})
	it("validate", () => {
		expect(model.Payment.validate(payment)).toEqual(true)
		expect(model.Payment.validate({ type: "card", limit: [10, "EUR"], card: "" })).toEqual(false)
		expect(model.Payment.validate(payment, [11, "EUR"])).toEqual(true)
		expect(model.Payment.validate(payment, [1, "EUR"])).toEqual(false)
		expect(model.Payment.validate(payment, [11, "SEK"])).toEqual(false)
	})
})
