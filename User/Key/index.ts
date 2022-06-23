import * as cryptly from "cryptly"
import * as isoly from "isoly"
import * as authly from "authly"

export interface Key {
	issuer: string
	audience: string
	issued: isoly.DateTime
	expires: isoly.DateTime
	token: string
	name: { first: string; last: string }
	email: string
	permissions: Record<"*", string> & Record<string /* organizationIds */, string>
}

const transformers: (authly.Property.Transformer | undefined)[] = [
	new authly.Property.Renamer({
		issuer: "iss",
		audience: "aud",
		issued: "iat",
		expires: "exp",
		email: "sub",
		permissions: "prm",
		name: "nam",
		token: "tok",
	}),
]
export type Issuers = "userwidget" | "wrangler"
const publicKeys: { [system in Issuers]: string } = {
	userwidget:
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqU98n52HN6Up2jO79MDvwnVc3nJrg8ahe40qarkvKGYDPP7TTJIM5JMMHFLQDk/dvRuFFvxmOFj29lI1shqICAhktOyQWB+BdwmnNuKwK1k6vwHGPPdijP7gZMeUXifO0BPbb+swtbwkATx+YT90haNi0Be3b7oUVOalnUC1LaEIT8xw+vSCs/wIdYkizNJl67d+6nHkeSOkkv8oAzaLU6OosflrGYk5IMeSuEJgw7TCM8jVSnqIVluGV0QtGGnZMuhFI3Rwc9L7ZbFaraX8RrcdR1S2MG8qksJwcL5QOzR02pHkFNtAg2LQcf0Lio6JOVAdGh1hCbHvGL46UfA1QIDAQAB",
	wrangler:
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqU98n52HN6Up2jO79MDvwnVc3nJrg8ahe40qarkvKGYDPP7TTJIM5JMMHFLQDk/dvRuFFvxmOFj29lI1shqICAhktOyQWB+BdwmnNuKwK1k6vwHGPPdijP7gZMeUXifO0BPbb+swtbwkATx+YT90haNi0Be3b7oUVOalnUC1LaEIT8xw+vSCs/wIdYkizNJl67d+6nHkeSOkkv8oAzaLU6OosflrGYk5IMeSuEJgw7TCM8jVSnqIVluGV0QtGGnZMuhFI3Rwc9L7ZbFaraX8RrcdR1S2MG8qksJwcL5QOzR02pHkFNtAg2LQcf0Lio6JOVAdGh1hCbHvGL46UfA1QIDAQAB",
}

export namespace Key {
	export function is(value: Key | any): value is Key & Record<string, string> {
		return (
			typeof value == "object" &&
			typeof value.email == "string" &&
			typeof value.name == "object" &&
			typeof value.name.first == "string" &&
			typeof value.name.last == "string" &&
			typeof value.permissions == "object" &&
			Object.entries(value.permissions).every(([k, v]) => typeof k == "string" && typeof v == "string") &&
			Object.keys(value.permissions).includes("*") &&
			typeof value.issuer == "string" &&
			typeof value.audience == "string" &&
			isoly.DateTime.is(value.issued) &&
			isoly.DateTime.is(value.expires) &&
			typeof value.token == "string"
		)
	}
	export function isIssuer(value: Key | any): value is Issuers {
		return Object.keys(publicKeys).includes(value)
	}
	export async function unpack(token: string): Promise<Key | undefined> {
		let result: Key | undefined
		const textDecoder = new cryptly.TextDecoder()
		if (token.split(".").length == 3) {
			const issuer = JSON.parse(textDecoder.decode(cryptly.Base64.decode(token.split(".")[1])))["iss"]
			if (Object.keys(publicKeys).includes(issuer) && token.split(".").pop()) {
				const verifier = Signed.Verifier.create(issuer)
				result = await verifier.verify(token)
			} else {
				const verifier = Unsigned.Verifier.create()
				result = await verifier.verify(token)
			}
		} else
			result = undefined
		return result
	}

	export type Verifier = authly.Verifier<Key>
	export namespace Signed {
		export namespace Verifier {
			export function create(issuer: Issuers): Verifier {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return authly.Verifier.create<Key>(authly.Algorithm.RS256(publicKeys[issuer]))!.add(...transformers)
			}
		}
	}

	export namespace Unsigned {
		export namespace Verifier {
			export function create(): Verifier {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return authly.Verifier.create<Key>(authly.Algorithm.none())!.add(...transformers)
			}
		}
	}
}
