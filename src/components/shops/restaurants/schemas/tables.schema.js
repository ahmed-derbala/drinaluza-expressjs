import mongoose from 'mongoose'
import { RestaurantRefSchema } from './restaurant-ref.schema.js'
import { WaiterSchema } from '#users/schemas/waiter.subschema.js'
import { MultiLangSchema } from '#multilang'
import { slugPlugin } from '#slug'

const tablesCollection = 'tables'

export const TableSchema = new mongoose.Schema(
	{
		restaurant: RestaurantRefSchema,
		waiters: [WaiterSchema],
		capacity: { type: Number, required: true, default: 4 },
		slug: { type: String, required: true, unique: true },
		name: MultiLangSchema
	},
	{ timestamps: true }
)

TableSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })

export const TableModel = mongoose.model(tablesCollection, TableSchema)
