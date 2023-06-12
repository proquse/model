import { issuefab } from "../index"

describe("LinK", () => {
	const link: issuefab.Transaction.Link = {
		receiptId: "qwe",
		transactionId: "asd",
	}
	it("is", () => {
		expect(issuefab.Transaction.Link.is(link)).toEqual(true)
	})
})
