import mongoose from 'mongoose'
import { CountPeriodSchema } from './count-period.schema.js'
import { PricePeriodSchema } from './price-period.schema.js'
import { BusinessRefSchema } from '#businesses/schemas/business-ref.schema.js'
import { ProductRefSchema } from '#products/schemas/product-ref.schema.js'
import { CustomerSchema } from '#users/schemas/customer.schema.js'

export const BusinessDashboardSchema = new mongoose.Schema(
	{
		business: BusinessRefSchema,
		sales: CountPeriodSchema,
		customers: CountPeriodSchema,
		products: {
			count: { type: Number, default: 0 },
			lowStock: { type: Number, default: 0 },
			outOfStock: { type: Number, default: 0 }
		},
		revenues: PricePeriodSchema,
		expenses: PricePeriodSchema,
		topProducts: {
			selling: [{ type: ProductRefSchema }],
			viewed: [{ type: ProductRefSchema }]
		},
		topCustomers: {
			frequent: [{ type: CustomerSchema }],
			new: [{ type: CustomerSchema }]
		}
	},
	{ _id: false, timestamps: true }
)
