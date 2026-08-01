import { OrderModel } from '../orders/orders.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'
export const findOneOrderRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const fetchedOrder = await OrderModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedOrder
	} catch (err) {
		errorHandler({ err })
	}
}
export const findOrdersRepo = async ({ match, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const fetchedOrders = paginateMongodb({ model: OrderModel, match: { ...flattenedMatch }, select: '', page, limit })
		return fetchedOrders
	} catch (err) {
		errorHandler({ err })
	}
}
export const createdOrderRepo = async ({ data }) => {
	try {
		const createdOrder = await OrderModel.create({ ...data })
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const patchSaleStatusRepo = async ({ match, status }) => {
	const flattenedMatch = flattenObject(match)
	const patchedOrder = await OrderModel.findOneAndUpdate({ ...flattenedMatch }, { status }, { returnDocument: 'after' })
	return patchedOrder
}

export const findMySalesRepo = async ({ match, page, limit, count, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		match = { ...flattenedMatch }
		if (count) {
			const salesCount = await OrderModel.countDocuments(match)
			return salesCount
		}
		const mySales = await paginateMongodb({ model: OrderModel, match, page, limit, select })
		return mySales
	} catch (err) {
		errorHandler({ err })
	}
}

export const patchSaleRepo = async ({ match, newData }) => {
	const { status, products } = newData
	const flattenedMatch = flattenObject(match)
	//_id is product row _id in products array, not product._id
	let bulkOps = products.map(({ _id, quantity }) => ({
		updateOne: {
			filter: { ...flattenedMatch, 'products._id': _id },
			update: { $set: { 'products.$.quantity': quantity } }
		}
	}))
	//update status after updating products
	bulkOps.push({
		updateOne: {
			filter: { ...flattenedMatch },
			update: { $set: { status } }
		}
	})
	console.log('bulkOps', JSON.stringify(bulkOps))
	return OrderModel.bulkWrite(bulkOps)
}
