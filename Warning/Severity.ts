import { isly } from "isly"

export type Severity = typeof Severity.values[number]
export namespace Severity {
	export const values = [0, 1, 2] as const
	export const type = isly.number<Severity>((value: any) => values.includes(value))
	export const is = type.is
	export const flaw = type.flaw
}
