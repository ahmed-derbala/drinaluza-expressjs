export const searchKeywordsField = {
	type: [String],
	index: true,
	set: (values) => Array.from(new Set(values.map((v) => v.toLowerCase().trim()).filter((v) => v.length > 0)))
}
