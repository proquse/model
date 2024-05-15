import { proquse } from "../index"

describe("Warning.Overallocated", () => {
	it("is", () => {
		const warning: proquse.Warning.Overallocation = {
			type: "overallocation",
			severity: 1,
			days: 14,
			source: "resource-id",
			message: "Overallocation in 14 days.",
		}
		expect(proquse.Warning.is(warning)).toEqual(true)
		expect(proquse.Warning.Overallocation.is(warning)).toEqual(true)
		expect(proquse.Warning.Overallocation.is((({ message, ...warning }) => warning)(warning))).toEqual(true)
		expect(proquse.Warning.Overallocation.is((({ type, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.Overallocation.is((({ severity, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.Overallocation.is((({ days, ...warning }) => warning)(warning))).toEqual(false)
		expect(proquse.Warning.Overallocation.is((({ source, ...warning }) => warning)(warning))).toEqual(false)
	})
})
