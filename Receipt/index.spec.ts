import * as model from "../index"

describe("Receipt", () => {
	const receipt: model.Receipt = {
		id: "asd",
		amount: [10, "USD"],
		date: "2022-01-01T00:00:42Z",
		vat: 0,
		original: "https://example.com/receipt.pdf",
	}
	it("is", () => {
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		const now = "2022-01-01T00:00:42Z"
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [10, "EUR"],
				date: now,
				vat: 0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(true)
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [0, "EUR"],
				date: now,
				vat: 0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(false)
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [10, "EUR"],
				date: now,
				vat: -0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(false)
		expect(model.Receipt.validate({ id: "id", amount: [10, "EUR"], date: now, vat: 0.2, original: "" })).toEqual(false)
	})
})
