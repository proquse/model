import { issuefab } from "../index"

describe("LinK", () => {
	const link: issuefab.Transaction.Link = {
		receiptId: "qwe",
		transactionId: "asd",
	}
	it("is", () => {
		expect(issuefab.Transaction.Link.is(link)).toEqual(true)
		expect(issuefab.Transaction.Link.is((({ receiptId, ...link }) => link)(link))).toEqual(false)
		expect(issuefab.Transaction.Link.is((({ transactionId, ...link }) => link)(link))).toEqual(false)
	})
})
