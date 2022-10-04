import * as model from "../index"
describe("Transaction", () => {
	const transaction: model.Transaction = {
		id: "asd",
		reference: "123",
		descriptor: "jest test",
		amount: [10, "EUR"],
		date: {
			transaction: "2021-12-22T13:37:42Z",
			payment: "2021-12-22T13:37:42Z",
		},
		receipt: "qwe",
	}
	it("is", () => {
		expect(model.Transaction.is(transaction)).toEqual(true)
	})
	it("linking", () => {
		const purchase: model.Purchase = {
			id: "aoeu1234",
			created: "2022-01-01T00:00:42Z",
			modified: "2022-01-01T00:00:42Z",
			buyer: "richard@example.com",
			amount: [30, "EUR"],
			purpose: "Production Workers",
			email: "receipt@example.com",
			payment: {
				type: "card",
				limit: [100, "EUR"],
				value: "someToken",
			},
			receipts: [
				{
					id: "1",
					amount: [10, "USD"],
					vat: 0,
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
				{
					id: "2",
					amount: [10, "USD"],
					vat: 0,
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
				{
					id: "3",
					amount: [10, "USD"],
					vat: 0,
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
			],
			transactions: [
				{
					id: "c",
					reference: "someid",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: {},
				},
				{
					id: "b",
					reference: "someid",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: {},
				},
				{
					id: "a",
					reference: "someid",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: {},
				},
			],
		}
		const remainder = model.Transaction.link(
			[
				{ receiptId: "1", transactionId: "a" },
				{ receiptId: "2", transactionId: "b" },
				{ receiptId: "4", transactionId: "d" },
			],
			purchase
		)
		expect(remainder).toEqual([{ receiptId: "4", transactionId: "d" }])
		expect(purchase.transactions[0].receipt).toEqual(undefined)
		expect(purchase.transactions[1].receipt).toEqual("2")
		expect(purchase.transactions[2].receipt).toEqual("1")
		expect(purchase.receipts[0].transaction).toEqual("a")
		expect(purchase.receipts[1].transaction).toEqual("b")
		expect(purchase.receipts[2].transaction).toEqual(undefined)
	})
})
