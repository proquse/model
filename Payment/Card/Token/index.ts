export interface Token {
	value: string
	supplier: string
}
export namespace Token {
	export function is(value: Token | any): value is Token & Record<string, any> {
		return typeof value == "object" && typeof value.value == "string" && typeof value.supplier == "string"
	}
	export function validate(token: Token): boolean {
		return !!token.value && !!token.supplier
	}
}
