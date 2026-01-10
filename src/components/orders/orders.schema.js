import mongoose from 'mongoose'
import { CustomerSchema } from '../users/schemas/customer.schema.js'
import { ProductRefSchema } from '../products/schemas/product-ref.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { orderStatusEnum } from './orders.enum.js'
import { CurrenciesSchema } from '../products/schemas/price.schema.js'
import { PriceSchema } from '../products/schemas/price.schema.js'
export const ordersCollection = 'orders'

const OrderProductsSchema = [
	{
		product: { type: ProductRefSchema, required: true },
		lineTotal: { type: CurrenciesSchema, required: true }, //basically quantity * price
		quantity: { type: Number, required: true, default: 1, min: 0.05 }
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
		},
		price: { type: PriceSchema, required: true }
	},
	{ timestamps: true, collection: ordersCollection }
)

export const OrderModel = mongoose.model(ordersCollection, OrderSchema)
