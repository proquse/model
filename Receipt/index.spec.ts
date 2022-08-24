import * as model from "../index"

describe("Receipt", () => {
	const receipt: model.Receipt = {
		amount: [10, "USD"],
		vat: 0,
		original: "https://example.com/receipt.pdf",
	}
	it("is", () => {
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		expect(
			model.Receipt.validate({ amount: [10, "EUR"], vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(true)
		expect(
			model.Receipt.validate({ amount: [0, "EUR"], vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(
			model.Receipt.validate({ amount: [10, "EUR"], vat: -0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(model.Receipt.validate({ amount: [10, "EUR"], vat: 0.2, original: "" })).toEqual(false)
	})
})
