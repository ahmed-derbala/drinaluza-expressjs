export const MultiLangSchema = {
	_id: false,
	en: {
		type: String,
		trim: true,
		required: true
	},
	tn_latn: {
		//tunisian with latin alphabet
		type: String,
		trim: true,
		required: true
	},
	tn_arab: {
		//tunisian with arabic alphabet
		type: String,
		trim: true,
		required: true
	}
}
