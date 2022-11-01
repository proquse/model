import * as fs from "fs/promises"
import * as model from "../index"

describe("Receipt", () => {
	const receipt: model.Receipt = {
		id: "asd",
		amount: [10, "USD"],
		date: "2022-01-01T00:00:42Z",
		vat: 0,
		original: "https://example.com/receipt.pdf",
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
								payment: { type: "card", limit: [10, "EUR"] },
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
										purchaseId: "y",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [10, "USD"],
										balance: [-10, "EUR"],
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
								payment: { type: "card", limit: [10, "EUR"] },
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
										purchaseId: "y",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [9, "USD"],
										balance: [-9, "EUR"],
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
						payment: { type: "card", limit: [5, "EUR"] },
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
								purchaseId: "y",
								date: {
									payment: "2022-01-01T00:00:42Z",
									transaction: "2022-01-02T00:00:42Z",
								},
								descriptor: "something",
								reference: "someId",
								amount: [10, "USD"],
								balance: [-10, "EUR"],
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
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		const now = "2022-01-01T00:00:42Z"
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [10, "EUR"],
				date: now,
				vat: 0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(true)
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [0, "EUR"],
				date: now,
				vat: 0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(false)
		expect(
			model.Receipt.validate({
				id: "id",
				amount: [10, "EUR"],
				date: now,
				vat: -0.2,
				original: "https://example.com/receipt.pdf",
			})
		).toEqual(false)
		expect(model.Receipt.validate({ id: "id", amount: [10, "EUR"], date: now, vat: 0.2, original: "" })).toEqual(false)
	})
	it("find", () => {
		expect(model.Receipt.find([delegation], "w")).toEqual({
			root: delegation,
			purchase: delegation.delegations[0].delegations[0].purchases[1],
			found: delegation.delegations[0].delegations[0].purchases[1].receipts[0],
		})
		expect(model.Receipt.find([delegation], "q")).not.toEqual(undefined)
		expect(model.Receipt.find([delegation], "e")).not.toEqual(undefined)
	})
	it("list", () => {
		expect(model.Receipt.list([delegation]).length).toEqual(3)
		expect(model.Receipt.list(delegation.delegations, (_, __, d) => d.costCenter == "IT").length).toEqual(3)
		expect(model.Receipt.list([delegation], (_, p) => p.buyer == "mary@example.com").length).toEqual(1)
		expect(model.Receipt.list([delegation], r => r.amount[0] >= 10).length).toEqual(2)
		const result = model.Receipt.list(
			[delegation],
			r => r.amount[0] >= 10,
			(r, p, d) => ({ ...r, purchaseId: p.id, delegationId: d.id })
		)
		expect(result.length).toEqual(2)
		expect(result.every(receipt => model.Receipt.is(receipt) && receipt.purchaseId && receipt.delegationId)).toEqual(
			true
		)
	})
	it("compile", async () => {
		const receiptA = new Uint8Array(await fs.readFile("./Receipt/receiptA.pdf"))
		const receiptB = new Uint8Array(await fs.readFile("./Receipt/receiptB.pdf"))
		const receipts: { details: model.Receipt; file: Uint8Array }[] = [
			{
				details: {
					id: "AAAA",
					original: "placeholder",
					amount: [1000, "EUR"],
					date: "2022-09-20T13:37:42Z",
					vat: 0.12,
				},
				file: receiptA,
			},
			{
				details: {
					id: "BBBB",
					original: "placeholder",
					amount: [1337, "EUR"],
					date: "2022-09-20T13:37:42Z",
					vat: 0.25,
				},
				file: receiptB,
			},
		]
		const receiptResult = await model.Receipt.compile(receipts, delegation, { start: "2022-09-19", end: "2022-09-21" })
		await fs.writeFile("./Receipt/receiptResult.pdf", receiptResult)
	})
})
