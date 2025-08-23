import mongoose from 'mongoose'
import { CreatedByUserSchema } from '../users/users.schema.js'
import { ProductRefSchema } from '../products/products.schema.js'
import { ShopRefSchema } from '../shops/shops.schema.js'
import { orderStatusEnum } from './orders.enum.js'
const ordersCollection = 'orders'
const orderProducts = [
	{
		product: ProductRefSchema,
		quantity: {
			type: Number,
			required: true,
			min: [1, 'Quantity must be at least 1']
		}
	}
]
const OrderSchema = new mongoose.Schema(
	{
		shop: { type: ShopRefSchema, required: true },
		createdByUser: { type: CreatedByUserSchema, required: true },
		products: { type: orderProducts, required: true, _id: false },
		status: {
			type: String,
			enum: orderStatusEnum,
			default: orderStatusEnum.PENDING_SHOP_CONFIRMATION,
			required: true
		}
	},
	{ timestamps: true, collection: ordersCollection }
)
export const OrderModel = mongoose.model(ordersCollection, OrderSchema)
export { ordersCollection }
export default {
	OrderModel,
	ordersCollection
}
