import * as model from "../index"

describe("Receipt", () => {
	const receipt: model.Receipt = {
		id: "asd",
		amount: [10, "USD"],
		vat: 0,
		original: "https://example.com/receipt.pdf",
	}
	it("is", () => {
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		expect(
			model.Receipt.validate({ id: "id", amount: [10, "EUR"], vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(true)
		expect(
			model.Receipt.validate({ id: "id", amount: [0, "EUR"], vat: 0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(
			model.Receipt.validate({ id: "id", amount: [10, "EUR"], vat: -0.2, original: "https://example.com/receipt.pdf" })
		).toEqual(false)
		expect(model.Receipt.validate({ id: "id", amount: [10, "EUR"], vat: 0.2, original: "" })).toEqual(false)
	})
})
