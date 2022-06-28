import * as model from "../index"

describe("Receipt", () => {
	const receipt: model.Receipt = {
		currency: "USD",
		amount: 10,
		vat: 0,
		original: "https://example.com/receipt.pdf",
	}
	it("is", () => {
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
})
