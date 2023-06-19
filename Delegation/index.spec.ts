import { issuefab } from "../index"

describe("Delegation", () => {
	const initialDelegation: issuefab.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: [],
		purpose: "Total company Budget",
		amount: [0, "EUR"],
		delegations: [],
		purchases: [],
	}
	const topLevelDelegation: issuefab.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: [],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [
							{
								id: "abcd0003",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: [1, "EUR"],
								delegations: [],
								purchases: [],
							},
						],
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
										id: "id",
										total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],

										date: "2022-01-01T00:00:42Z",

										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [],
							},
							{
								id: "aoeu1234",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [],
								transactions: [],
							},
						],
					},
				],
				purchases: [
					{
						id: "aoeu2345",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: { type: "card", limit: [10, "EUR"] },
						receipts: [
							{
								id: "id",
								total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
								date: "2022-01-01T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
						transactions: [],
					},
				],
			},
			{
				id: "abcd0004",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
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
		expect(issuefab.Delegation.is(initialDelegation)).toEqual(true)
		expect(issuefab.Delegation.is(topLevelDelegation)).toEqual(true)
	})

	it("findUser", () => {
		expect(issuefab.Delegation.findUser([topLevelDelegation], "john@example.com")).toEqual([
			topLevelDelegation.delegations[0].delegations[0].delegations[0],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(new Set(issuefab.Delegation.findUser([topLevelDelegation], "richard@example.com"))).toEqual(
			new Set([topLevelDelegation.delegations[1], topLevelDelegation.delegations[0].delegations[0]])
		)
	})
	it("find", () => {
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0001")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0002")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[0],
		})
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0005")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[1].delegations[0],
		})
	})
	it("findParent", () => {
		expect(issuefab.Delegation.findParent([topLevelDelegation], topLevelDelegation.delegations[0].id)).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(issuefab.Delegation.findParent([topLevelDelegation.delegations[1]], "abcd0006")).toEqual({
			root: topLevelDelegation.delegations[1],
			found: topLevelDelegation.delegations[1].delegations[0],
		})
		expect(issuefab.Delegation.findParent([topLevelDelegation.delegations[0]], "abcd0006")).toEqual(undefined)
	})
	it("change", () => {
		let before: issuefab.Delegation = {
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
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		let updated: issuefab.Delegation = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [3000, "EUR"],
			delegations: [],
			purchases: [],
		}
		let after: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		let result = issuefab.Delegation.change([before], updated)
		expect(before).toEqual(after)
		expect(result).toEqual({ root: before, changed: updated })
		const final = { ...before, to: ["jane@example.com"] }
		result = issuefab.Delegation.change([before], final)
		expect(before).toEqual(final)
		expect(result).toEqual({ root: before, changed: final })

		before = {
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
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		updated = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "changed",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [3000, "EUR"],
			delegations: [],
			purchases: [],
		}
		after = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "changed",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
		updated = { ...updated, id: "abcd0001" }
		after = { ...updated }
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual({ root: after, changed: after })
	})
	it("remove", () => {
		const toBeRemoved: issuefab.Delegation = {
			id: "abcd0003",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [2000, "EUR"],
			delegations: [],
			purchases: [],
		}
		const after: issuefab.Delegation = {
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
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		const before: issuefab.Delegation = {
			...after,
			delegations: [...after.delegations, toBeRemoved],
		}
		expect(issuefab.Delegation.remove([before], toBeRemoved.id)).toEqual({ root: before, removed: toBeRemoved })
		expect(before).toEqual(after)
		expect(issuefab.Delegation.remove([before], before.id)).toEqual({ root: before, removed: before })
		expect(issuefab.Delegation.remove([after], "xyz")).toEqual(undefined)
	})
	it("spent", () => {
		expect(issuefab.Delegation.spent(topLevelDelegation)).toEqual(29)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[1])).toEqual(0)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0])).toEqual(19.5)
		expect(issuefab.Delegation.spent(topLevelDelegation, true)).toEqual(29)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0].delegations[0], true)).toEqual(19.5)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0], true)).toEqual(29)
	})
	it("balance", () => {
		expect(issuefab.Delegation.balance(topLevelDelegation)).toEqual(16000)
		expect(issuefab.Delegation.balance(topLevelDelegation.delegations[1].delegations[0].delegations[0])).toEqual(1000)
	})
	it("create", () => {
		expect(
			issuefab.Delegation.is(issuefab.Delegation.create(issuefab.Delegation.Creatable.create(), "mary@example.com"))
		).toEqual(true)
	})
	it("findParents", () => {
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
		])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0001")).toEqual([])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0002")).toEqual([topLevelDelegation])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "xyz")).toEqual(undefined)
	})
	it("path", () => {
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0001")).toEqual([topLevelDelegation])
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
			topLevelDelegation.delegations[0].delegations[0],
		])
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
			topLevelDelegation.delegations[1].delegations[0].delegations[0],
		])
	})
	it("validate", () => {
		const testFrom: issuefab.Delegation = {
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
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					costCenter: "IT",
					from: "",
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		const testCostCenter: issuefab.Delegation = {
			id: "abcd0001",
			from: "",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: [],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					costCenter: "",
					from: "John@example.com",
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		expect(issuefab.Delegation.validate(topLevelDelegation, undefined, true)).toEqual(true)
		expect(issuefab.Delegation.validate(initialDelegation, undefined, true)).toEqual(true)
		expect(issuefab.Delegation.validate(testFrom)).toEqual(false)
		expect(issuefab.Delegation.validate(testCostCenter, undefined, true)).toEqual(false)
	})
	it("temp", () => {
		const roots: issuefab.Delegation[] = [
			{
				to: [],
				purpose: "Marketing",
				amount: [10100, "EUR"],
				costCenter: "Marketing",
				id: "4d_qD6So",
				from: "jane@issuefab.com",
				created: "2023-05-29T07:00:46.818Z",
				modified: "2023-05-29T07:00:46.818Z",
				purchases: [],
				delegations: [
					{
						purpose: "Online advertisment",
						amount: [10000, "EUR"],
						to: ["john@issuefab.com", "jane@issuefab.com"],
						costCenter: "Marketing",
						id: "AnY6XJG_",
						from: "jane@issuefab.com",
						created: "2023-05-29T07:04:38.822Z",
						modified: "2023-06-19T09:02:27.091Z",
						purchases: [
							{
								id: "Ycrhhe4U",
								created: "2023-06-13T09:14:27.590Z",
								modified: "2023-06-13T09:14:27.590Z",
								payment: {
									type: "expense",
									limit: [100, "EUR"],
								},
								purpose: "Google ads",
								buyer: "john@issuefab.com",
								email: "receipt+71MH0lsx_Ycrhhe4U@issuefab.com",
								receipts: [
									{
										id: "Tvvm-80b",
										date: "2023-06-13T09:14:45.216Z",
										original: "https://api.issuefab.com/receipt/Ycrhhe4U/Tvvm-80b",
										total: [
											{
												net: [50, "EUR"],
												vat: [50, "EUR"],
											},
										],
									},
								],
								transactions: [],
							},
							{
								id: "tjES9aPH",
								created: "2023-06-19T09:11:36.713Z",
								modified: "2023-06-19T09:11:36.713Z",
								payment: {
									type: "expense",
									limit: [100, "EUR"],
								},
								purpose: "Facebook ads",
								buyer: "john@issuefab.com",
								email: "receipt+71MH0lsx_tjES9aPH@issuefab.com",
								receipts: [],
								transactions: [],
							},
						],
						delegations: [
							{
								purpose: "Google ads",
								amount: [1000, "EUR"],
								to: ["james@issuefab.com"],
								costCenter: "Marketing",
								id: "8KI1t-Bu",
								from: "john@issuefab.com",
								created: "2023-05-29T17:32:41.922Z",
								modified: "2023-05-29T17:32:41.922Z",
								purchases: [],
								delegations: [],
							},
							{
								purpose: "facebook ads",
								amount: [1000, "EUR"],
								to: ["john@issuefab.com"],
								costCenter: "Marketing",
								id: "Hv8iHE5E",
								from: "jane@issuefab.com",
								created: "2023-06-19T09:19:38.794Z",
								modified: "2023-06-19T09:19:38.794Z",
								purchases: [],
								delegations: [],
							},
						],
					},
					{
						purpose: "Stationary",
						amount: [100, "EUR"],
						to: ["jane@issuefab.com"],
						costCenter: "Marketing",
						id: "5aV1tLdw",
						from: "jane@issuefab.com",
						created: "2023-06-19T08:51:29.589Z",
						modified: "2023-06-19T08:51:29.589Z",
						purchases: [
							{
								id: "Py3v_YtS",
								created: "2023-06-19T08:52:03.305Z",
								modified: "2023-06-19T08:52:03.305Z",
								payment: {
									type: "expense",
									limit: [13, "EUR"],
								},
								purpose: "Pencils",
								buyer: "jane@issuefab.com",
								email: "receipt+71MH0lsx_Py3v_YtS@issuefab.com",
								receipts: [],
								transactions: [],
							},
							{
								id: "5eF23Gwh",
								created: "2023-06-19T08:53:58.893Z",
								modified: "2023-06-19T08:53:58.893Z",
								payment: {
									type: "expense",
									limit: [15, "EUR"],
								},
								purpose: "Paper",
								buyer: "jane@issuefab.com",
								email: "receipt+71MH0lsx_5eF23Gwh@issuefab.com",
								receipts: [],
								transactions: [],
							},
						],
						delegations: [],
					},
				],
			},
			{
				to: [],
				purpose: "Development",
				amount: [100000, "EUR"],
				costCenter: "Development",
				id: "Fc95eZwA",
				from: "jane@issuefab.com",
				created: "2023-05-29T08:04:55.451Z",
				modified: "2023-05-29T08:04:55.451Z",
				purchases: [],
				delegations: [
					{
						purpose: "Software services",
						amount: [100000, "EUR"],
						to: ["james@issuefab.com"],
						costCenter: "Development",
						id: "WRO2-u5C",
						from: "jane@issuefab.com",
						created: "2023-05-29T08:05:43.221Z",
						modified: "2023-05-29T08:05:43.221Z",
						purchases: [
							{
								id: "HseFHVmI",
								created: "2023-05-29T08:07:49.227Z",
								modified: "2023-05-29T08:07:49.227Z",
								payment: {
									type: "pre-paid",
									limit: [50, "EUR"],
								},
								purpose: "Domain",
								buyer: "james@issuefab.com",
								email: "receipt+71MH0lsx_HseFHVmI@issuefab.com",
								receipts: [
									{
										id: "O5ScI86L",
										date: "2023-05-29T09:00:25.122Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/O5ScI86L",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "xWwZ3Uyf",
										date: "2023-05-29T09:24:38.985Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/xWwZ3Uyf",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "zMI6iCns",
										date: "2023-05-29T09:33:56.722Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/zMI6iCns",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "BYGtgRVp",
										date: "2023-05-29T09:36:33.423Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/BYGtgRVp",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "c2T05-Q7",
										date: "2023-05-29T09:42:53.419Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/c2T05-Q7",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "y_wU6KeV",
										date: "2023-05-29T09:55:10.250Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/y_wU6KeV",
										total: [
											{
												net: [50, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "cLDpb535",
										date: "2023-05-29T09:55:48.765Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/cLDpb535",
										total: [
											{
												net: [60, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "Hqf5tzWr",
										date: "2023-05-29T12:21:02.977Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/Hqf5tzWr",
										total: [
											{
												net: [70, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "KW6xi-AE",
										date: "2023-05-29T12:36:45.952Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/KW6xi-AE",
										total: [
											{
												net: [70, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "VOJG6lqq",
										date: "2023-05-29T12:44:21.470Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/VOJG6lqq",
										total: [
											{
												net: [70, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "cmBNObMi",
										date: "2023-05-29T13:04:58.096Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/cmBNObMi",
										total: [
											{
												net: [70, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
									{
										id: "TQYQb_TN",
										date: "2023-05-29T13:23:03.895Z",
										original: "https://api.issuefab.com/receipt/HseFHVmI/TQYQb_TN",
										total: [
											{
												net: [70, "EUR"],
												vat: [0, "EUR"],
											},
										],
									},
								],
								transactions: [],
							},
						],
						delegations: [],
					},
				],
			},
			{
				to: [],
				purpose: "mystic coin",
				amount: [0, "EUR"],
				costCenter: "Travel",
				id: "gmGkNqBq",
				from: "jessie@issuefab.com",
				created: "2023-05-29T17:09:29.481Z",
				modified: "2023-05-29T17:09:29.481Z",
				purchases: [],
				delegations: [],
			},
		]
		console.log(issuefab.Delegation.findUser(roots, "john@issuefab.com"))
	})
})
