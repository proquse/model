import { issuefab } from "../index"

describe("Amount", () => {
	const amount: issuefab.Amount = {
		value: 1_000.5,
		currency: "SEK",
	}
	it("is", () => {
		expect(issuefab.Amount.is(amount)).toEqual(true)
		expect(issuefab.Amount.is((({ currency, ...amount }) => amount)(amount))).toEqual(false)
		expect(issuefab.Amount.is((({ value, ...amount }) => amount)(amount))).toEqual(false)
	})
})
