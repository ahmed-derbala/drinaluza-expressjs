const mongoose = require('mongoose')
const { CreatedByUserSchema } = require('../users/users.schema')
const { ProductRefSchema } = require('../products/products.schema')
const { ShopRefSchema } = require('../shops/shops.schema')
const { BusinessRefSchema } = require('../businesses/businessRef.schema')

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
		business: { type: BusinessRefSchema, required: true },
		shop: { type: ShopRefSchema, required: true },
		createdByUser: { type: CreatedByUserSchema, required: true },
		products: { type: orderProducts, required: true, _id: false },
		status: {
			type: String,
			enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
			default: 'pending'
		}
	},
	{ timestamps: true, collection: ordersCollection }
)

module.exports = {
	OrderModel: mongoose.model(ordersCollection, OrderSchema),
	ordersCollection
}
