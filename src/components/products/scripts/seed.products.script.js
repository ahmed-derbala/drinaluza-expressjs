// This script connects to the MongoDB database and seeds the 'products' collection
// with sample product data, using existing shops and owners.

import { connectMongodb } from '../../../core/db/index.js'
import { log } from '../../../core/log/index.js'
import mongoose from 'mongoose'
import { ProductModel } from '../products.schema.js'
import { ShopModel } from '../../shops/shops.schema.js'
import { UserModel } from '../../users/users.schema.js'

// Sample product data
const productTemplates = [
	{
		name: 'Fresh Tuna',
		description: 'Premium quality fresh tuna, perfect for sushi or grilling',
		category: 'Fish',
		unit: 'KG',
		basePrice: 45,
		stock: { quantity: 50, minThreshold: 10 }
	},
	{
		name: 'Atlantic Salmon',
		description: 'Fresh Atlantic salmon fillets, skin on',
		category: 'Fish',
		unit: 'KG',
		basePrice: 55,
		stock: { quantity: 35, minThreshold: 8 }
	},
	{
		name: 'Tiger Prawns',
		description: 'Jumbo tiger prawns, 10-12 pieces per kg',
		category: 'Shellfish',
		unit: 'KG',
		basePrice: 70,
		stock: { quantity: 25, minThreshold: 5 }
	},
	{
		name: 'Black Mussels',
		description: 'Fresh black mussels, cleaned and debearded',
		category: 'Shellfish',
		unit: 'KG',
		basePrice: 25,
		stock: { quantity: 40, minThreshold: 15 }
	},
	{
		name: 'Whole Octopus',
		description: 'Fresh Mediterranean octopus, cleaned',
		category: 'Cephalopods',
		unit: 'KG',
		basePrice: 40,
		stock: { quantity: 15, minThreshold: 3 }
	}
]

/**
 * Seed products into the database
 */
export const seedProducts = async () => {
	try {
		await connectMongodb()
		log({ message: 'Starting products seed script...', level: 'info' })

		// Get existing shops with their owners
		const shops = await ShopModel.find({})
			.populate({
				path: 'owner._id',
				select: 'profile'
			})
			.lean()

		if (shops.length === 0) {
			throw new Error('No shops found. Please seed shops first.')
		}

		// Delete existing products
		await ProductModel.deleteMany({})
		log({ message: 'Cleared existing products', level: 'info' })

		const products = []

		// Create products for each shop
		for (const shop of shops) {
			// Check if owner exists and has profile
			if (!shop.owner || !shop.owner._id || !shop.owner._id.profile) {
				log({
					message: `Skipping shop ${shop.name} - owner or profile not found`,
					level: 'warn'
				})
				continue
			}

			// Each shop gets a subset of products
			const productCount = Math.floor(Math.random() * 3) + 2 // 2-4 products per shop

			for (let i = 0; i < productCount; i++) {
				const template = productTemplates[(shop._id.toString().charCodeAt(0) + i) % productTemplates.length]
				const priceVariance = Math.random() * 0.3 + 0.85 // 85-115% of base price

				const product = new ProductModel({
					name: template.name,
					description: template.description,
					price: {
						value: {
							tnd: Math.round(template.basePrice * priceVariance * 10) / 10, // Round to 1 decimal
							eur: Math.round(template.basePrice * priceVariance * 0.3 * 10) / 10,
							usd: Math.round(template.basePrice * priceVariance * 0.32 * 10) / 10
						},
						unit: {
							name: template.unit,
							symbol: template.unit === 'KG' ? 'kg' : 'pcs'
						}
					},
					photos: [], // Will be populated with actual file references in production
					searchTerms: [
						template.name.toLowerCase(),
						template.category.toLowerCase(),
						'seafood',
						'fresh',
						shop.owner._id.profile.firstName.toLowerCase(),
						shop.owner._id.profile.lastName.toLowerCase()
					],
					isActive: Math.random() > 0.1, // 90% chance of being active
					stock: {
						quantity: template.stock.quantity,
						minThreshold: template.stock.minThreshold
					},
					availability: {
						startDate: new Date(),
						endDate: null
					},
					shop: {
						_id: shop._id,
						name: shop.name,
						slug: shop.slug,
						owner: shop.owner
					}
				})

				products.push(await product.save())
				log({
					message: `Created product: ${product.name} for shop: ${shop.name}`,
					level: 'info'
				})
			}
		}

		log({
			message: `Successfully seeded ${products.length} products`,
			level: 'success'
		})

		return products
	} catch (error) {
		log({
			message: 'Error seeding products',
			error: error.message,
			stack: error.stack,
			level: 'error'
		})
		throw error
	} finally {
		// Close the connection when done
		await mongoose.connection.close()
	}
}

// Run the seed if this file is executed directly
if (process.argv[1] === import.meta.filename) {
	seedProducts()
		.then(() => process.exit(0))
		.catch(() => process.exit(1))
}
