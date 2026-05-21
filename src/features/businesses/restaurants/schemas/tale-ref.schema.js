import { OwnerSchema } from '#users/schemas/owner.schema.js'
import { MultiLangSchema } from '#multilang'
import { WaiterSchema } from '#users/schemas/waiter.subschema.js'
import { RestaurantRefSchema } from './restaurant-ref.schema.js'

export const TableRefSchema = {
	restaurant: RestaurantRefSchema,
	waiters: [WaiterSchema],
	capacity: { type: Number, required: true, default: 4 },
	slug: { type: String, required: true, unique: true },
	name: MultiLangSchema
}
