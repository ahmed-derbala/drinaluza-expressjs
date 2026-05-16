import mongoose from 'mongoose'
import { CustomerSchema } from '../users/schemas/customer.schema.js'
import { ProductRefSchema } from '../products/schemas/product-ref.schema.js'
import { BusinessRefSchema } from '../businesses/schemas/business-ref.schema.js'
import { orderStatusEnum } from './orders.enum.js'
import { CurrenciesSubSchema } from '../products/schemas/price.schema.js'
import { PriceSubSchema } from '../products/schemas/price.schema.js'
import { ORDER_KINDS, ORDER_KINDS_ALL } from './orders.constant.js'
import { RestaurantOrderSchema } from './schemas/restaurant-order.schema.js'
export const ordersCollection = 'orders'

const OrderProductsSchema = [
	{
		product: { type: ProductRefSchema, required: true },
		lineTotal: CurrenciesSubSchema, //basically quantity * price
		quantity: { type: Number, required: true, default: 1, min: 0.05 },
		note: { type: String }
	}
]

const OrderSchema = new mongoose.Schema(
	{
		business: { type: BusinessRefSchema, required: true },
		customer: { type: CustomerSchema, required: true },
		products: OrderProductsSchema,
		status: {
			type: String,
			enum: orderStatusEnum,
			default: orderStatusEnum.PENDING_BUSINESS_CONFIRMATION,
			required: true
		},
		price: PriceSubSchema,
		kind: { type: String, enum: ORDER_KINDS_ALL(), required: true, default: ORDER_KINDS.TABLE }
	},
	{ collection: ordersCollection, timestamps: true, discriminatorKey: 'kind' }
)

OrderSchema.discriminator(ORDER_KINDS.TABLE, RestaurantOrderSchema)

OrderSchema.index({ 'customer.location': '2dsphere' })
export const OrderModel = mongoose.model(ordersCollection, OrderSchema)
