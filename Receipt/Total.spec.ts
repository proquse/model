import * as model from "../index"

describe("Receipt.Total", () => {
	it("is", () => {
		const total: model.Receipt.Total = {
			net: [10, "EUR"],
			vat: [2.5, "EUR"],
		}
		expect(model.Receipt.Total.is(total)).toEqual(true)
	})
})
