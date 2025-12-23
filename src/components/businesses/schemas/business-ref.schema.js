import mongoose from 'mongoose'
import { businessesCollection } from '../businesses.schema.js'
import { StateSchema } from '../../../core/db/mongodb/shared-schemas/state.schema.js'
//import { BusinessOwnerSchema } from '../../users/schemas/business-owner.schema.js'

export const BusinessRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: businessesCollection,
			required: true
		},
		//owner: { type: BusinessOwnerSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: { type: String, required: true },
		state: { type: StateSchema, required: true }
	},
	{ _id: false }
)
