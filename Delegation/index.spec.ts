import * as model from "../index"

describe("Delegation", () => {
	const initialDelegation: model.Delegation = {
		id: "abcd0001",
		created: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [],
		purchases: [],
	}
	const topLevelDelegation: model.Delegation = {
		id: "abcd0001",
		created: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd002",
				created: "2021-12-22T13:37:42Z",
				to: ["jane@example.com"],
				costCenter: "IT",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd002",
						created: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [],
						purchases: [
							{
								id: "aoeu1234",
								created: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [9.5, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									card: "4200000000/2202/aoeuhatns",
								},
								receipt: {
									currency: "USD",
									amount: 10,
									vat: 0,
									original: "https://example.com/receipt.pdf",
								},
							},
							{
								id: "aoeu1234",
								created: "2022-02-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									card: "4200000020/2202/aoeuhatns",
								},
								receipt: { to: "receipt+aoeu1234@company.com" },
							},
						],
					},
				],
				purchases: [],
			},
		],
		purchases: [],
	}

	it("initialDelegation", () => {
		expect(initialDelegation).not.toEqual(42)
	})
	it("topLevelDelegation", () => {
		expect(topLevelDelegation).not.toEqual(42)
	})
})
