import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/shops.schema.js'
import { CreatedByUserSchema, usersCollection } from '../users/users.schema.js'
const businessesCollection = 'businesses'
const schema = new mongoose.Schema(
	{
		name: String,
		createdByUser: CreatedByUserSchema,
		shops: [{ type: ShopRefSchema, required: [false, 'eeee'] }]
	},
	{ timestamps: true, collection: businessesCollection }
)
export const BusinessModel = mongoose.model(businessesCollection, schema)
export { businessesCollection }
export default {
	BusinessModel,
	businessesCollection
}
