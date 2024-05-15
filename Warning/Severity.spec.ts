import { proquse } from "../index"

describe("Warning.Severity", () => {
	it("is", () => {
		const severity: proquse.Warning.Severity = 0
		expect(proquse.Warning.Severity.is(severity)).toEqual(true)
		expect(proquse.Warning.Severity.is(-1)).toEqual(false)
		expect(proquse.Warning.Severity.is(3)).toEqual(false)
	})
})
