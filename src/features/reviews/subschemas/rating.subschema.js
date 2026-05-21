export const RatingSubschema = {
	average: { type: Number, required: true, min: 0, max: 5, default: 0 },
	count: { type: Number, required: true, min: 0, default: 0 },
	total: { type: Number, required: true, min: 0, default: 0 },
	breakdown: {
		1: { type: Number, required: true, min: 0, default: 0 },
		2: { type: Number, required: true, min: 0, default: 0 },
		3: { type: Number, required: true, min: 0, default: 0 },
		4: { type: Number, required: true, min: 0, default: 0 },
		5: { type: Number, required: true, min: 0, default: 0 }
	}
}
