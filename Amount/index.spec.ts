import * as model from "../index"

describe("Amount", () => {
	it("is", () => {
		expect(model.Amount.is([1, "EUR"])).toEqual(true)
	})
})
