import { proquse } from "../index"

describe("Warning.MissingReceipt", () => {
	it("is", () => {
		const warning: proquse.Warning.MissingReceipt = {
			type: "missing-receipt",
			severity: 2,
			source: "resource-id",
		}
		expect(proquse.Warning.is(warning)).toEqual(true)
		expect(proquse.Warning.MissingReceipt.is(warning)).toEqual(true)
	})
})
