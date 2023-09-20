import { proquse } from "../index"

describe("Amount", () => {
	const amount: proquse.Amount = {
		value: 1_000.5,
		currency: "SEK",
	}
	it("is", () => {
		expect(proquse.Amount.is(amount)).toEqual(true)
		expect(proquse.Amount.is((({ currency, ...amount }) => amount)(amount))).toEqual(false)
		expect(proquse.Amount.is((({ value, ...amount }) => amount)(amount))).toEqual(false)
	})
})
