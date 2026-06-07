export const RatingSubschema = {
	_id: false,
	average: { type: Number, required: true, min: 0, max: 5, default: 0 }, //total/count
	count: { type: Number, required: true, min: 0, default: 0 }, //how many times it got rated
	total: { type: Number, required: true, min: 0, default: 0 }, //the sum of all stars
	breakdown: {
		1: { type: Number, required: true, min: 0, default: 0 },
		2: { type: Number, required: true, min: 0, default: 0 },
		3: { type: Number, required: true, min: 0, default: 0 },
		4: { type: Number, required: true, min: 0, default: 0 },
		5: { type: Number, required: true, min: 0, default: 0 }
	}
}
