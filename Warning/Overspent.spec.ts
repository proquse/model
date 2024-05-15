import { proquse } from "../index"

describe("Warning.Overspent", () => {
	it("is", () => {
		const warning: proquse.Warning.Overspent = {
			type: "overspent",
			severity: 2,
			source: "resource-id",
			message: "Missing a receipt.",
		}
		expect(proquse.Warning.is(warning)).toEqual(true)
		expect(proquse.Warning.Overspent.is(warning)).toEqual(true)
		expect(proquse.Warning.Overspent.is((({ message, ...warning }) => warning)(warning))).toEqual(true)
		expect(proquse.Warning.Overspent.is((({ severity, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.Overspent.is((({ source, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.Overspent.is((({ type, ...warning }) => warning)(warning))).toEqual(false)
	})
})
