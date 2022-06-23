export interface Name {
	first: string
	last: string
}

export namespace Name {
	export function is(value: Name | any): value is Name & Record<string, any> {
		return typeof value == "object" && typeof value.first == "string" && typeof value.last == "string"
	}
}
