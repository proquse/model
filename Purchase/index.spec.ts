import { issuefab } from "../index"

describe("Purchase", () => {
	const purchase: issuefab.Purchase = {
		id: "p",
		created: "2023-01-01T00:00:42Z",
		modified: "2023-01-01T00:00:42Z",
		buyer: "richard.stevensson@example.com",
		purpose: "Production Workers",
		email: "receipt@example.com",
		payment: { type: "card", limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" } },
		receipts: [
			{
				id: "id",
				total: [
					{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } },
					{ net: { value: 20, currency: "USD" }, vat: { value: 5, currency: "USD" } },
				],
				date: "2023-01-01T00:00:42Z",
				original: "https://example.com/receipt.pdf",
			},
		],
		transactions: [],
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
								transactions: [],
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
								transactions: [],
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
						transactions: [],
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
		expect(issuefab.Purchase.is(purchase)).toEqual(true)
		expect(issuefab.Purchase.is((({ id, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ created, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ modified, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ buyer, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ purpose, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ email, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ payment, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ receipts, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ transactions, ...purchase }) => purchase)(purchase))).toEqual(false)
	})
	it("create", () => {
		const purchase: issuefab.Purchase.Creatable = {
			purpose: "buy things",
			payment: {
				type: "card",
				limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
			},
			buyer: "jane@example.com",
		}
		const result = issuefab.Purchase.create(purchase, "organizationId", "receipt@example.com")
		expect(issuefab.Purchase.is(result))
		expect(result.email).toMatch(/^receipt\+organizationId_[^@]+@example.com$/)
	})
	it("find", () => {
		expect(issuefab.Purchase.find([costCenter], "p1")).toEqual({
			root: costCenter,
			parent: costCenter.delegations[0].delegations[0],
			found: costCenter.delegations[0].delegations[0].purchases[0],
		})
	})
	it("change", () => {
		const target: issuefab.Purchase = issuefab.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
				},
				buyer: "jane@example.com",
			},
			"organizationId",
			"receipt@example.com"
		)
		const updated: issuefab.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" } },
			buyer: "john@example.com",
		}
		const after: issuefab.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" } },
			buyer: "john@example.com",
		}
		const root: issuefab.Delegation = {
			id: "d1",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["mary@example.com"],
			costCenter: "IT",
			from: "john@example.com",
			purpose: "hosting costs",
			amount: { cadence: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [target],
		}
		expect(target).not.toEqual(updated)
		const first = issuefab.Purchase.change(target, updated)
		expect(target).toEqual(after)
		expect(first).not.toBe(after)
		const second = issuefab.Purchase.change([root], updated)
		expect(second).toEqual({ root: root, parent: root, changed: updated })
		expect(second?.changed).not.toBe(updated)
	})
	it("remove", () => {
		const target: issuefab.Purchase = issuefab.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
				},
				buyer: "jane@example.com",
			},
			"organizationId",
			"receipt@example.com"
		)
		const root: issuefab.Delegation = {
			id: "d1",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["mary@example.com"],
			costCenter: "IT",
			from: "john@example.com",
			purpose: "hosting costs",
			amount: { cadence: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [target],
		}
		const result = issuefab.Purchase.remove([root], target.id)
		expect(root.purchases.length).toEqual(0)
		expect(result?.removed).toBe(target)
	})
	it("list", () => {
		expect(issuefab.Purchase.list(costCenter.delegations).length).toEqual(3)
		expect(
			issuefab.Purchase.list(
				costCenter.delegations,
				purchase => issuefab.Cadence.allocated(purchase.payment.limit, "2023-12-31") <= 500
			).length
		).toEqual(2)
		expect(
			issuefab.Purchase.list(costCenter.delegations, purchase => purchase.buyer == "mary@example.com").length
		).toEqual(1)
		const result = issuefab.Purchase.list(
			[costCenter],
			p => p.buyer == "mary@example.com",
			(p, d) => ({ ...p, delegationId: d.id })
		)
		expect(result.length).toEqual(1)
		expect(result.every(purchase => issuefab.Purchase.is(purchase) && purchase.delegationId)).toEqual(true)
	})
	it("spent", () => {
		expect(issuefab.Purchase.spent(purchase)).toEqual(37.5)
		expect(issuefab.Purchase.spent(purchase, { vat: false })).toEqual(30)
		expect(issuefab.Purchase.spent(costCenter.delegations[0].purchases[0])).toEqual(598)
	})
	it("validate", () => {
		console.log(issuefab.Purchase.validate(purchase, "2022-12-31"))
	})
})
