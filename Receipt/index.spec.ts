import { proquse } from "../index"

describe("Receipt", () => {
	const receipt: proquse.Receipt = {
		id: "---r----",
		original: "https://example.com/receipt.pdf",
		total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
		date: "2022-01-01T00:00:42Z",
	}
	const costCenter: proquse.CostCenter = {
		id: "c1------",
		from: "jane@example.com",
		name: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		description: "Total company Budget",
		amount: { interval: "year", value: 20_000, currency: "EUR", created: "2023-01-01" },
		type: "costCenter",
		usage: [
			{
				id: "c1d1----",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "delegation",
				usage: [
					{
						id: "c1d1d2--",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: { interval: "year", value: 1_200, currency: "EUR", created: "2023-01-01" },
						type: "delegation",
						usage: [
							{
								id: "c1d1d2d3",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: { interval: "year", value: 100, currency: "EUR", created: "2023-01-01" },
								type: "delegation",
								usage: [],
							},
							{
								id: "c1d1d2p1",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								type: "purchase",
								payment: {
									type: "card",
									limit: { interval: "month", value: 15, currency: "EUR", created: "2023-01-01" },
									mask: "012345******6789",
									expires: { month: 4, year: 24 },
									reference: "reference",
								},
								transactions: [],
								receipts: [
									{
										id: "r1------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-01-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r2------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-02-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r3------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-03-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r4------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-04-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r5------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-05-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r6------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-06-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r7------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-07-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r8------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-08-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r9------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-09-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r10-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-10-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r11-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-11-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r12-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-12-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
							},
							{
								id: "c1d1d2p2",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								type: "purchase",
								payment: {
									type: "card",
									limit: { interval: "month", value: 30, currency: "EUR", created: "2023-01-01" },
									mask: "012345******6789",
									expires: { month: 4, year: 24 },
									reference: "reference",
								},
								transactions: [],
								receipts: [],
							},
						],
					},
					{
						id: "c1d1d2p3",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						purpose: "Production Workers",
						type: "purchase",
						payment: {
							type: "card",
							limit: { interval: "month", value: 300, currency: "EUR", created: "2023-11-15" },
							mask: "012345******6789",
							expires: { month: 4, year: 24 },
							reference: "reference",
						},
						transactions: [],
						receipts: [
							{
								id: "r13-----",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
							{
								id: "r14-----",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
					},
				],
			},
			{
				id: "c1d4----",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "delegation",
				usage: [
					{
						id: "c1d4d5--",
						created: "2023-01-01T13:37:42Z",
						modified: "2023-01-01T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: { interval: "year", value: 1_000, currency: "EUR", created: "2023-01-01" },
						type: "delegation",
						usage: [
							{
								id: "c1d4d5d6",
								created: "2023-01-01T13:37:42Z",
								modified: "2023-01-01T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: { interval: "month", value: 100, currency: "EUR", created: "2023-03-01" },
								type: "delegation",
								usage: [],
							},
						],
					},
				],
			},
			{
				id: "c1c2----",
				from: "jane@example.com",
				name: "partial budget",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				description: "Partial company budget",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "costCenter",
				usage: [],
			},
		],
	}
	it("is", () => {
		expect(proquse.Receipt.is(receipt)).toEqual(true)
		expect(proquse.Receipt.is((({ original, ...receipt }) => receipt)(receipt))).toEqual(false)
	})
	it("validate", () => {
		expect(
			proquse.Receipt.validate(
				(costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0],
				(costCenter.usage[0].usage[1] as proquse.Purchase).payment.limit.currency
			)
		).toEqual({ status: true })
		expect(proquse.Receipt.validate((costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0], "AMD")).toEqual({
			status: false,
			reason: "currency",
			origin: (costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0],
		})
		expect(proquse.CostCenter.validate(costCenter)).toEqual({ status: true })
		const receipt: proquse.Receipt = { ...(costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0], total: [] }
		expect(
			proquse.Receipt.validate(receipt, (costCenter.usage[0].usage[1] as proquse.Purchase).payment.limit.currency)
		).toEqual({ status: false, reason: "amount", origin: receipt })
	})
	it("spent", () => {
		expect(
			proquse.Receipt.spent(
				(costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0],
				(costCenter.usage[0].usage[1] as proquse.Purchase).payment.limit.currency
			)
		).toEqual(299)
		expect(
			proquse.Receipt.spent(
				(costCenter.usage[0].usage[1] as proquse.Purchase).receipts[0],
				(costCenter.usage[0].usage[1] as proquse.Purchase).payment.limit.currency,
				{ vat: false }
			)
		).toEqual(299)
		expect(
			proquse.Receipt.spent(
				((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).receipts[0],
				((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).payment.limit.currency
			)
		).toEqual(12.5)
		expect(
			proquse.Receipt.spent(
				((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).receipts[0],
				((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).payment.limit.currency,
				{ vat: false }
			)
		).toEqual(10)
	})
	it("find", () => {
		expect(proquse.Receipt.find([costCenter], "r1------")).toEqual({
			root: costCenter,
			delegation: costCenter.usage[0].usage[0],
			purchase: (costCenter.usage[0].usage[0] as proquse.Delegation).usage[1],
			found: ((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).receipts[0],
		})
		expect(proquse.Receipt.find([costCenter], "r14-----")).toEqual({
			root: costCenter,
			delegation: costCenter.usage[0],
			purchase: costCenter.usage[0].usage[1],
			found: (costCenter.usage[0].usage[1] as proquse.Purchase).receipts[1],
		})
		expect(proquse.Receipt.find([costCenter], "r12-----")).toEqual({
			root: costCenter,
			delegation: costCenter.usage[0].usage[0],
			purchase: (costCenter.usage[0].usage[0] as proquse.Delegation).usage[1],
			found: ((costCenter.usage[0].usage[0] as proquse.Delegation).usage[1] as proquse.Purchase).receipts[11],
		})
	})
	it("list", () => {
		expect(proquse.Receipt.list([costCenter]).length).toEqual(14)
		expect(proquse.Receipt.list(costCenter.usage, (_, __, d) => d.costCenter == "IT").length).toEqual(14)
		expect(proquse.Receipt.list([costCenter], (_, p) => p.buyer == "mary@example.com").length).toEqual(2)
		expect(
			proquse.Receipt.list(
				[costCenter],
				(receipt, purchase) => proquse.Receipt.spent(receipt, purchase.payment.limit.currency) < 100
			).length
		).toEqual(12)
		const result = proquse.Receipt.list(
			[costCenter],
			(receipt, purchase) => proquse.Receipt.spent(receipt, purchase.payment.limit.currency) > 100,
			(r, p, d) => ({ ...r, purchase: p.id, delegation: d.id })
		)
		expect(result.length).toEqual(2)
	})
	it("remove", () => {
		const receipt: proquse.Receipt = {
			id: "r1p1d1c1",
			date: "2024-03-21T12:54:19.442Z",
			original: "https://origin.tld/path",
			total: [{ net: { value: 50, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
		}
		const purchase: proquse.Purchase = {
			type: "purchase",
			id: "--p1d1c1",
			email: "receipt+-rocket-_--p1d1c1@proquse.com",
			buyer: "jessie@rocket.com",
			purpose: "buss ticket",
			payment: {
				type: "card",
				reference: "card-reference",
				expires: { year: 25, month: 4 },
				mask: "**** **** **** 0123",
				limit: { value: 50, currency: "EUR", created: "2024-03-21", interval: "single" },
			},
			receipts: [receipt],
			transactions: [
				{
					card: { reference: "card-reference" },
					reference: "transaction-reference",
					status: "finalized",
					amount: { value: 50, currency: "EUR" },
					receipts: [receipt.id],
					operations: [
						{
							type: "authorize",
							reference: "authorization-reference",
							status: "success",
							amount: { account: { value: 50, currency: "EUR" }, merchant: { value: 50, currency: "EUR" }, rate: 1 },
							created: "2024-03-21T12:54:19.442Z",
							modified: "2024-03-21T12:54:19.442Z",
						},
						{
							type: "capture",
							status: "success",
							reference: "capture-reference",
							amount: { account: { value: 50, currency: "EUR" }, merchant: { value: 50, currency: "EUR" }, rate: 1 },
							created: "2024-03-22T12:54:19.442Z",
							modified: "2024-03-22T12:54:19.442Z",
						},
					],
					merchant: { category: "category", country: "DE", descriptor: "descriptor" },
					created: "2024-03-21T12:54:19.442Z",
					modified: "2024-03-22T12:54:19.442Z",
				},
			],
			created: "2024-03-21T12:54:19.442Z",
			modified: "2024-03-21T12:54:19.442Z",
		}
		const delegation: proquse.Delegation = {
			type: "delegation",
			id: "----d1c1",
			costCenter: "Travel",
			usage: [purchase],
			from: purchase.buyer,
			to: [purchase.buyer],
			purpose: "Bus",
			amount: { value: 250, created: "2024-03-20", currency: "EUR", interval: "month" },
			created: "2024-03-20T12:54:19.442Z",
			modified: "2024-03-20T12:54:19.442Z",
		}
		const root: proquse.CostCenter = {
			type: "costCenter",
			id: "------c1",
			name: "Travel",
			from: delegation.from,
			amount: { value: 500, created: "2024-03-20", currency: "EUR", interval: "month" },
			usage: [delegation],
			created: "2024-03-20T12:54:19.442Z",
			modified: "2024-03-20T12:54:19.442Z",
		}
		const result = proquse.Receipt.remove([root], receipt.id)
		expect(result).not.toBeUndefined()
		expect(result?.root).toEqual(root)
		expect(result?.delegation).toEqual(delegation)
		expect(result?.purchase).toEqual(purchase)
		expect(result?.removed).toEqual(receipt)
		expect(purchase.receipts.includes(receipt)).toEqual(false)
		expect(purchase.transactions.some(transaction => transaction.receipts.includes(receipt.id))).toEqual(false)
	})
})
