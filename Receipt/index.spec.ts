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
	it("validate", () => {
		expect(
			model.Receipt.validate({ currency: "EUR", amount: 10, vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(true)
		expect(
			model.Receipt.validate({ currency: "EUR", amount: 0, vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(
			model.Receipt.validate({ currency: "EUR", amount: 10, vat: -0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(model.Receipt.validate({ currency: "EUR", amount: 10, vat: 0.2, original: "" })).toEqual(false)
	})
})
