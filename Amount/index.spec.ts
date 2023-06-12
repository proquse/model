import { issuefab } from "../index"

describe("Amount", () => {
	it("is", () => {
		expect(issuefab.Amount.is([1, "EUR"])).toEqual(true)
	})
	it("validate", () => {
		expect(issuefab.Amount.validate([0, "EUR"])).toEqual(false)
		expect(issuefab.Amount.validate([1, "EUR"])).toEqual(true)
		expect(issuefab.Amount.validate([1, "EUR"], [10, "EUR"])).toEqual(true)
		expect(issuefab.Amount.validate([1, "EUR"], [10, "SEK"])).toEqual(false)
		expect(issuefab.Amount.validate([11, "EUR"], [10, "EUR"])).toEqual(false)
		expect(issuefab.Amount.validate([11, "EUR"], [10, "SEK"])).toEqual(false)
		expect(issuefab.Amount.validate([-1, "EUR"])).toEqual(false)
		expect(issuefab.Amount.validate([1, "EUR"], undefined)).toEqual(true)
	})
})
