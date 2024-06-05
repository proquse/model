export type Validation<T> =
	| { status: true }
	| {
			status: false
			reason: "overallocated" | "overspent" | "currency" | "time" | "exchange" | "amount"
			origin: T
	  }
