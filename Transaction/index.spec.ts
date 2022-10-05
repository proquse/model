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
	const delegation: model.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				from: "jane@example.com",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						from: "jane@example.com",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [],
						purchases: [
							{
								id: "aoeu1234",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [9.5, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
								},
								receipts: [
									{
										id: "q",
										amount: [10, "USD"],
										vat: 0,
										date: "2022-01-01T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [
									{
										id: "1",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [10, "USD"],
									},
								],
							},
							{
								id: "aoeu2345",
								email: "receipt@example.com",
								created: "2022-02-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
								},
								receipts: [
									{
										id: "w",
										amount: [9, "USD"],
										vat: 0,
										date: "2022-01-01T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [
									{
										id: "2",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [9, "USD"],
									},
								],
							},
						],
					},
				],
				purchases: [
					{
						id: "aoeu3456",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: {
							type: "card",
							limit: [5, "EUR"],
							value: "someToken",
						},
						receipts: [
							{
								id: "e",
								amount: [10, "USD"],
								vat: 0,
								date: "2022-01-01T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
						transactions: [
							{
								id: "3",
								date: {
									payment: "2022-01-01T00:00:42Z",
									transaction: "2022-01-02T00:00:42Z",
								},
								descriptor: "something",
								reference: "someId",
								amount: [10, "USD"],
							},
						],
					},
				],
			},
			{
				id: "abcd0004",
				from: "jane@example.com",
				created: "2021-12-28T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						from: "jane@example.com",
						costCenter: "IT",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								from: "jane@example.com",
								costCenter: "IT",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								purpose: "Partial company budget",
								amount: [1000, "EUR"],
								delegations: [],
								purchases: [],
							},
						],
						purchases: [],
					},
				],
				purchases: [],
			},
		],
		purchases: [],
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
	it("find", () => {
		expect(model.Transaction.find(delegation.delegations, "3")).toEqual({
			root: delegation.delegations[0],
			purchase: delegation.delegations[0].purchases[0],
			found: delegation.delegations[0].purchases[0].transactions[0],
		})
	})
	it("list", () => {
		expect(model.Transaction.list([delegation]).length).toEqual(3)
		expect(model.Transaction.list([delegation], (_, __, d) => d.costCenter == "IT").length).toEqual(3)
		expect(model.Transaction.list([delegation], t => t.amount[0] < 10).length).toEqual(1)
		expect(model.Transaction.list([delegation], (_, p) => p.buyer == "richard@example.com").length).toEqual(2)
	})
})
