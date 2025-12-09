import mongoose from 'mongoose'
import { CustomerSchema } from '../users/schemas/customer.schema.js'
import { ProductRefSchema } from '../products/products.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { orderStatusEnum } from './orders.enum.js'
import { FinalPriceSchema } from '../products/schemas/final-price.schema.js'

export const ordersCollection = 'orders'

const OrderProductsSchema = [
	{
		product: ProductRefSchema,
		quantity: {
			type: Number,
			required: true,
			min: [1, 'Quantity must be at least 1']
		},
		finalPrice: { type: FinalPriceSchema, required: true }
	}
]

const OrderSchema = new mongoose.Schema(
	{
		shop: { type: ShopRefSchema, required: true },
		customer: { type: CustomerSchema, required: true },
		products: { type: OrderProductsSchema, required: true, _id: false },
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
