import { isly } from "isly"
import { Severity } from "./Severity"

export interface Base {
	source: string
	severity: Severity
	message?: string
}
export namespace Base {
	export const type = isly.object<Base>({
		severity: Severity.type,
		source: isly.string(),
		message: isly.string().optional(),
	})
}
