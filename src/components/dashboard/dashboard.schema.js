import mongoose from 'mongoose'
import { dashboardCollection } from '#dashboard/dashboard.constant.js'
import { UserRefSchema } from '#users/schemas/user-ref.schema.js'
import { PriceSubSchema } from '#core'

const DashboardSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		sales: {
			today: { type: Number, default: 0 },
			thisWeek: { type: Number, default: 0 },
			thisMonth: { type: Number, default: 0 },
			thisYear: { type: Number, default: 0 },
			allTime: { type: Number, default: 0 }
		},
		purchases: {
			today: { type: Number, default: 0 },
			thisWeek: { type: Number, default: 0 },
			thisMonth: { type: Number, default: 0 },
			thisYear: { type: Number, default: 0 },
			allTime: { type: Number, default: 0 }
		},
		customers: {
			today: { type: Number, default: 0 },
			thisWeek: { type: Number, default: 0 },
			thisMonth: { type: Number, default: 0 },
			thisYear: { type: Number, default: 0 },
			allTime: { type: Number, default: 0 }
		},
		products: {
			count: { type: Number, default: 0 },
			lowStock: { type: Number, default: 0 },
			outOfStock: { type: Number, default: 0 }
		},
		revenues: {
			today: { type: PriceSubSchema, default: 0 },
			thisWeek: { type: PriceSubSchema, default: 0 },
			thisMonth: { type: PriceSubSchema, default: 0 },
			thisYear: { type: PriceSubSchema, default: 0 },
			allTime: { type: PriceSubSchema, default: 0 }
		},
		expenses: {
			today: { type: PriceSubSchema, default: 0 },
			thisWeek: { type: PriceSubSchema, default: 0 },
			thisMonth: { type: PriceSubSchema, default: 0 },
			thisYear: { type: PriceSubSchema, default: 0 },
			allTime: { type: PriceSubSchema, default: 0 }
		}
	},
	{ collection: dashboardCollection, timestamps: true }
)
export const DashboardModel = mongoose.model(dashboardCollection, DashboardSchema)
