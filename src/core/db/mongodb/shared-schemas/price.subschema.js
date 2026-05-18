export const CurrenciesSubSchema = {
	tnd: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	eur: {
		type: Number,
		required: false,
		default: null,
		min: 0
	},
	usd: {
		type: Number,
		required: false,
		default: null,
		min: 0
	}
}

export const PriceSubSchema = {
	subtotal: { type: CurrenciesSubSchema, required: false },
	discount: Number,
	tax: Number,
	shipping: Number,
	total: { type: CurrenciesSubSchema, required: true, _id: false } // final payable amount
}
