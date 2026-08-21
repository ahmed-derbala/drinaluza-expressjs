import { MultiLangSchema } from './multi-lang.schema.js'

export const AddressSchema = {
	_id: false,
	street: { type: MultiLangSchema, required: false },
	city: {
		type: String,
		required: true,
		trim: true,
		default: 'Ellouza'
	},
	region: {
		type: String,
		required: true,
		trim: true,
		default: 'Sfax'
	},
	country: {
		type: String,
		required: true,
		trim: true,
		default: 'Tunisia'
	}
}
