import mongoose from 'mongoose'
import { CountPeriodSchema } from './count-period.schema.js'
import { PricePeriodSchema } from './price-period.schema.js'
import { BusinessRefSchema } from '#businesses/schemas/business-ref.schema.js'

export const PersonalDashboardSchema = new mongoose.Schema(
	{
		purchases: CountPeriodSchema,
		expenses: PricePeriodSchema,
		topBusinesses: {
			new: [{ BusinessRefSchema }],
			frequent: [{ BusinessRefSchema }]
		}
	},
	{ _id: false, timestamps: true }
)
