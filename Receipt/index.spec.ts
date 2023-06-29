import { issuefab } from "../index"

describe("Receipt", () => {
	const receipt: issuefab.Receipt = {
		id: "asd",
		original: "https://example.com/receipt.pdf",
		total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
		date: "2022-01-01T00:00:42Z",
	}
	const costCenter: issuefab.CostCenter = {
		id: "c1",
		from: "jane@example.com",
		name: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		description: "Total company Budget",
		amount: { cadence: "year", value: 20_000, currency: "EUR", created: "2023-01-01" },
		delegations: [
			{
				id: "d1",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: { cadence: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				delegations: [
					{
						id: "d2",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: { cadence: "year", value: 1_200, currency: "EUR", created: "2023-01-01" },
						delegations: [
							{
								id: "d3",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: { cadence: "year", value: 100, currency: "EUR", created: "2023-01-01" },
								delegations: [],
								purchases: [],
							},
						],
						purchases: [
							{
								id: "p1",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: { cadence: "month", value: 15, currency: "EUR", created: "2023-01-01" },
								},
								receipts: [
									{
										id: "r1",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-01-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r2",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-02-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r3",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-03-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r4",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-04-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r5",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-05-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r6",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-06-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r7",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-07-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r8",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-08-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r9",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-09-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r10",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-10-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r11",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-11-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r12",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-12-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
							},
							{
								id: "p2",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: { cadence: "month", value: 30, currency: "EUR", created: "2023-01-01" },
								},
								receipts: [],
							},
						],
					},
				],
				purchases: [
					{
						id: "p3",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						purpose: "Production Workers",
						payment: { type: "card", limit: { cadence: "month", value: 300, currency: "EUR", created: "2023-11-15" } },
						receipts: [
							{
								id: "r13",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
							{
								id: "r14",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
					},
				],
			},
			{
				id: "d4",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: { cadence: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				delegations: [
					{
						id: "d5",
						created: "2023-01-01T13:37:42Z",
						modified: "2023-01-01T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: { cadence: "year", value: 1_000, currency: "EUR", created: "2023-01-01" },
						delegations: [
							{
								id: "d6",
								created: "2023-01-01T13:37:42Z",
								modified: "2023-01-01T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: { cadence: "month", value: 100, currency: "EUR", created: "2023-03-01" },
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
		costCenters: [
			{
				id: "c2",
				from: "jane@example.com",
				name: "partial budget",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				description: "Partial company budget",
				amount: { cadence: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				costCenters: [],
				delegations: [],
			},
		],
	}
	it("is", () => {
		expect(issuefab.Receipt.is(receipt)).toEqual(true)
		expect(issuefab.Receipt.is((({ original, ...receipt }) => receipt)(receipt))).toEqual(false)
	})
	it("validate", () => {
		expect(
			issuefab.Receipt.validate(
				costCenter.delegations[0].purchases[0].receipts[0],
				costCenter.delegations[0].purchases[0].payment.limit.currency
			)
		).toEqual(true)
		expect(issuefab.Receipt.validate(costCenter.delegations[0].purchases[0].receipts[0], "AMD")).toEqual(false)
	})
	it("spent", () => {
		expect(
			issuefab.Receipt.spent(
				costCenter.delegations[0].purchases[0].receipts[0],
				costCenter.delegations[0].purchases[0].payment.limit.currency
			)
		).toEqual(299)
		expect(
			issuefab.Receipt.spent(
				costCenter.delegations[0].purchases[0].receipts[0],
				costCenter.delegations[0].purchases[0].payment.limit.currency,
				{ vat: false }
			)
		).toEqual(299)
		expect(
			issuefab.Receipt.spent(
				costCenter.delegations[0].delegations[0].purchases[0].receipts[0],
				costCenter.delegations[0].delegations[0].purchases[0].payment.limit.currency
			)
		).toEqual(12.5)
		expect(
			issuefab.Receipt.spent(
				costCenter.delegations[0].delegations[0].purchases[0].receipts[0],
				costCenter.delegations[0].delegations[0].purchases[0].payment.limit.currency,
				{ vat: false }
			)
		).toEqual(10)
	})
	it("find", () => {
		expect(issuefab.Receipt.find([costCenter], "r1")).toEqual({
			root: costCenter,
			delegation: costCenter.delegations[0].delegations[0],
			purchase: costCenter.delegations[0].delegations[0].purchases[0],
			found: costCenter.delegations[0].delegations[0].purchases[0].receipts[0],
		})
		expect(issuefab.Receipt.find([costCenter], "r14")).toEqual({
			root: costCenter,
			delegation: costCenter.delegations[0],
			purchase: costCenter.delegations[0].purchases[0],
			found: costCenter.delegations[0].purchases[0].receipts[1],
		})
		expect(issuefab.Receipt.find([costCenter], "r12")).toEqual({
			root: costCenter,
			delegation: costCenter.delegations[0].delegations[0],
			purchase: costCenter.delegations[0].delegations[0].purchases[0],
			found: costCenter.delegations[0].delegations[0].purchases[0].receipts[11],
		})
	})
	it("list", () => {
		expect(issuefab.Receipt.list([costCenter]).length).toEqual(14)
		expect(issuefab.Receipt.list(costCenter.delegations, (_, __, d) => d.costCenter == "IT").length).toEqual(14)
		expect(issuefab.Receipt.list([costCenter], (_, p) => p.buyer == "mary@example.com").length).toEqual(2)
		expect(
			issuefab.Receipt.list(
				[costCenter],
				(receipt, purchase) => issuefab.Receipt.spent(receipt, purchase.payment.limit.currency) < 100
			).length
		).toEqual(12)
		const result = issuefab.Receipt.list(
			[costCenter],
			(receipt, purchase) => issuefab.Receipt.spent(receipt, purchase.payment.limit.currency) > 100,
			(r, p, d) => ({ ...r, purchase: p.id, delegation: d.id })
		)
		expect(result.length).toEqual(2)
		expect(result.every(receipt => issuefab.Receipt.is(receipt) && receipt.purchase && receipt.delegation)).toEqual(
			true
		)
	})
})
