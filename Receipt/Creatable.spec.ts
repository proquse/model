import * as model from "../index"

describe("Receipt.Creatable", () => {
	const creatable: model.Receipt.Creatable = {
		amount: [10, "EUR"],
		vat: 0.25,
		file: new Uint8Array(),
	}
	it("is", () => {
		expect(model.Receipt.Creatable.is(creatable)).toEqual(true)
	})
})
