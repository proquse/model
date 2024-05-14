import { proquse } from "../../index"

describe("Warning.Entry", () => {
	it("is", () => {
		const entry: proquse.Warning.Record.Entry = {
			value: [{ type: "overallocation", severity: 0, days: 123, source: "resource-id" }],
			child: [{ type: "missing-receipt", severity: 0, source: "resource-id" }],
		}
		expect(proquse.Warning.Record.Entry.is(entry)).toEqual(true)
	})
})
