import { proquse } from "../../index"

describe("Warning.Record", () => {
	it("is", () => {
		const record: proquse.Warning.Record = {
			["resource-id"]: {
				value: [{ type: "overallocation", severity: 0, days: 123, source: "resource-id" }],
				child: [{ type: "missing-receipt", severity: 0, source: "resource-id" }],
			},
		}
		expect(proquse.Warning.Record.is(record)).toEqual(true)
		expect(proquse.Warning.Record.is({})).toEqual(true)
		expect(proquse.Warning.Record.is([])).toEqual(false)
	})
})
