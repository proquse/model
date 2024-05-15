import { proquse } from "../index"

describe("Warning.MissingReceipt", () => {
	it("is", () => {
		const warning: proquse.Warning.MissingReceipt = {
			type: "missing-receipt",
			severity: 2,
			source: "resource-id",
			message: "Missing a receipt.",
		}
		expect(proquse.Warning.is(warning)).toEqual(true)
		expect(proquse.Warning.MissingReceipt.is(warning)).toEqual(true)
		expect(proquse.Warning.MissingReceipt.is((({ message, ...warning }) => warning)(warning))).toEqual(true)
		expect(proquse.Warning.MissingReceipt.is((({ severity, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.MissingReceipt.is((({ source, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.MissingReceipt.is((({ type, ...warning }) => warning)(warning))).toEqual(false)
	})
})
