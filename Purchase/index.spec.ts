import { proquse } from "../index"

describe("Purchase", () => {
	const purchase: proquse.Purchase = {
		id: "---p----",
		created: "2023-01-01T00:00:42Z",
		modified: "2023-01-01T00:00:42Z",
		buyer: "richard.stevensson@example.com",
		purpose: "Production Workers",
		email: "receipt@example.com",
		type: "purchase",
		payment: {
			type: "card",
			limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
			mask: "012345******6789",
			expires: { month: 4, year: 24 },
			reference: "reference",
		},
		transactions: [],
		receipts: [
			{
				id: "---id---",
				total: [
					{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } },
					{ net: { value: 20, currency: "EUR" }, vat: { value: 5, currency: "EUR" } },
				],
				date: "2023-01-01T00:00:42Z",
				original: "https://example.com/receipt.pdf",
			},
		],
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
						id: "c1d1p3--",
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
		expect(proquse.Purchase.is(purchase)).toEqual(true)
		expect(proquse.Purchase.is((({ id, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ created, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ modified, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ buyer, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ purpose, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ email, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ payment, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(proquse.Purchase.is((({ receipts, ...purchase }) => purchase)(purchase))).toEqual(false)
	})
	it("find", () => {
		expect(proquse.Purchase.find([costCenter], "c1d1d2p1")).toEqual({
			root: costCenter,
			parent: costCenter.usage[0].usage[0],
			found: (costCenter.usage[0].usage[0] as proquse.Delegation).usage[1],
		})
	})
	it("change", () => {
		const target: proquse.Purchase = {
			purpose: "buy things",
			payment: {
				type: "card",
				limit: {
					interval: "month",
					value: 10,
					currency: "EUR",
					created: "2023-01-01",
				},
				mask: "012345******6789",
				expires: { month: 4, year: 24 },
				reference: "reference",
			},
			buyer: "jane@example.com",
			id: "1ZpzxMe2",
			created: "2024-03-21T12:54:19.442Z",
			modified: "2024-03-21T12:54:19.442Z",
			email: "receipt+organizationId_1ZpzxMe2@example.com",
			receipts: [],
			transactions: [],
			type: "purchase",
		}
		const updated: proquse.Purchase = {
			...target,
			purpose: "buy more things",
			payment: {
				type: "card",
				limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
				mask: "012345******6789",
				expires: { month: 4, year: 24 },
				reference: "reference",
			},
			buyer: "john@example.com",
		}
		const after: proquse.Purchase = {
			...target,
			purpose: "buy more things",
			payment: {
				type: "card",
				limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
				mask: "012345******6789",
				expires: { month: 4, year: 24 },
				reference: "reference",
			},
			buyer: "john@example.com",
		}
		const root: proquse.Delegation = {
			id: "d1",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["mary@example.com"],
			costCenter: "IT",
			from: "john@example.com",
			purpose: "hosting costs",
			amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [target],
		}
		expect(target).not.toEqual(updated)
		const first = proquse.Purchase.change(target, updated)
		expect(target).toEqual(after)
		expect(first).not.toBe(after)
		const second = proquse.Purchase.change([root], updated)
		expect(second).toEqual({ root: root, parent: root, changed: updated })
		expect(second?.changed).not.toBe(updated)
	})
	it("remove", () => {
		const target: proquse.Purchase = {
			purpose: "buy things",
			payment: {
				type: "card",
				limit: {
					interval: "month",
					value: 10,
					currency: "EUR",
					created: "2023-01-01",
				},
				mask: "012345******6789",
				expires: { month: 4, year: 24 },
				reference: "reference",
			},
			buyer: "jane@example.com",
			id: "1ZpzxMe2",
			created: "2024-03-21T12:54:19.442Z",
			modified: "2024-03-21T12:54:19.442Z",
			email: "receipt+organizationId_1ZpzxMe2@example.com",
			receipts: [],
			transactions: [],
			type: "purchase",
		}
		const root: proquse.Delegation = {
			id: "d1",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["mary@example.com"],
			costCenter: "IT",
			from: "john@example.com",
			purpose: "hosting costs",
			amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [target],
		}
		const result = proquse.Purchase.remove([root], target.id)
		expect(root.usage.length).toEqual(0)
		expect(result?.removed).toBe(target)
	})
	it("list", () => {
		expect(proquse.Purchase.list(costCenter.usage).length).toEqual(3)
		expect(
			proquse.Purchase.list(
				costCenter.usage,
				(purchase, delegation) =>
					proquse.Cadence.allocated(
						proquse.Payment.exchange(purchase.payment, delegation.amount.currency) ?? purchase.payment.limit,
						"2023-12-31"
					) <= 500
			).length
		).toEqual(2)
		expect(proquse.Purchase.list(costCenter.usage, purchase => purchase.buyer == "mary@example.com").length).toEqual(1)
		const result = proquse.Purchase.list(
			[costCenter],
			p => p.buyer == "mary@example.com",
			(p, d) => ({ ...p, delegationId: d.id })
		)
		expect(result.length).toEqual(1)
	})
	it("spent", () => {
		expect(proquse.Purchase.spent(purchase)).toEqual(37.5)
		expect(proquse.Purchase.spent(purchase, { vat: false })).toEqual(30)
		expect(proquse.Purchase.spent(costCenter.usage[0].usage[1] as proquse.Purchase)).toEqual(598)
	})
	it("validate", () => {
		expect(proquse.Purchase.validate(purchase, { date: "2023-12-31" })).toEqual({ status: true })
		expect(proquse.Purchase.validate(purchase, { date: "2022-12-31" })).toEqual({
			status: false,
			reason: "overallocated",
			origin: purchase,
		})
		let p: proquse.Purchase = {
			...purchase,
			payment: { ...purchase.payment, limit: { ...purchase.payment.limit, interval: "year" } },
		}
		expect(proquse.Purchase.validate(p, { date: "2023-12-31" })).toEqual({ status: true })
		p = { ...purchase, payment: { ...purchase.payment, limit: { ...purchase.payment.limit, interval: "year" } } }
		expect(proquse.Purchase.validate(p, { date: "2023-12-31", spent: true })).toEqual({
			status: false,
			reason: "overspent",
			origin: p,
		})
	})
})
