import mongoose from 'mongoose'
import { dashboardCollection } from '#dashboard/dashboard.constant.js'
import { UserRefSchema } from '#users/schemas/user-ref.schema.js'
import { PriceSubSchema } from '#core'
import { PersonalDashboardSchema } from './schemas/personal-dashboard.schema.js'
import { BusinessDashboardSchema } from './schemas/business-dashboard.schema.js'

const DashboardSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		kind: { type: String, enum: ['personal', 'business'], required: true, default: 'personal' }
	},
	{ collection: dashboardCollection, timestamps: true, discriminatorKey: 'kind' }
)

DashboardSchema.discriminator('personal', PersonalDashboardSchema)
DashboardSchema.discriminator('business', BusinessDashboardSchema)

export const DashboardModel = mongoose.model(dashboardCollection, DashboardSchema)
