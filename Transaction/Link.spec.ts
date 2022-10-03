import * as model from "../index"

describe("LinK", () => {
	const link: model.Transaction.Link = {
		receiptId: "qwe",
		transactionId: "asd",
	}
	it("is", () => {
		expect(model.Transaction.Link.is(link)).toEqual(true)
	})
})
