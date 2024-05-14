import { isly } from "isly"
import { Entry as RecordEntry } from "./Entry"

export type Record = globalThis.Record<string, Record.Entry | undefined>
export namespace Record {
	export import Entry = RecordEntry
	export const type = isly.record<Record>(isly.string(), isly.union(RecordEntry.type, isly.undefined()))
	export const is = type.is
	export const flaw = type.flaw
}
