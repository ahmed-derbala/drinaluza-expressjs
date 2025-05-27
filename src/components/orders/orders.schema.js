const mongoose = require('mongoose')
const { OrderedByUserSchema } = require('../users/users.schema')
const { ProductRefSchema } = require('../products/productRef.schema')

const ordersCollection = 'orders'

const OrderSchema = new mongoose.Schema(
	{
		orderedByUser: OrderedByUserSchema,
		products: [
			{
				product: ProductRefSchema,
				quantity: {
					type: Number,
					required: true,
					min: [1, 'Quantity must be at least 1']
				}
			}
		],
		totalAmount: {
			type: Number,
			required: true,
			min: [0, 'Total amount cannot be negative']
		},
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
