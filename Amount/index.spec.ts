import * as model from "../index"

describe("Amount", () => {
	it("is", () => {
		expect(model.Amount.is([1, "EUR"])).toEqual(true)
	})
	it("validate", () => {
		expect(model.Amount.validate([0, "EUR"])).toEqual(false)
		expect(model.Amount.validate([1, "EUR"])).toEqual(true)
		expect(model.Amount.validate([1, "EUR"], [10, "EUR"])).toEqual(true)
		expect(model.Amount.validate([1, "EUR"], [10, "SEK"])).toEqual(false)
		expect(model.Amount.validate([11, "EUR"], [10, "EUR"])).toEqual(false)
		expect(model.Amount.validate([11, "EUR"], [10, "SEK"])).toEqual(false)
		expect(model.Amount.validate([-1, "EUR"])).toEqual(false)
		expect(model.Amount.validate([1, "EUR"], undefined, true)).toEqual(true)
		expect(model.Amount.validate([0, "EUR"], undefined, true)).toEqual(true)
	})
})
