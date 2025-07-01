import mongoose from 'mongoose'
import { defaultProductsCollection } from './default-products.schema.js'
export const defaultProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		name: {
			en: {
				type: String,
				required: true
			},
			tn: {
				type: String,
				required: false
			},
			tn_ar: {
				type: String,
				required: false
			}
		}
	},
	{ _id: false, timestamps: true }
)
