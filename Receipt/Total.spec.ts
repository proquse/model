import { issuefab } from "../index"

describe("Receipt.Total", () => {
	it("is", () => {
		const total: issuefab.Receipt.Total = {
			net: [10, "EUR"],
			vat: [2.5, "EUR"],
		}
		expect(issuefab.Receipt.Total.is(total)).toEqual(true)
	})
})
