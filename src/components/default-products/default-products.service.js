import { errorHandler } from '../../core/error/index.js'
import { findOneDefaultProductRepo, findDefaultProductsRepo, createDefaultProductRepo } from './default-products.repository.js'
import { processSlug } from '../../core/db/mongodb/slug-plugin.js'
import config from '../../config/index.js'
export const findOneDefaultProductSrvc = async ({ slug }) => {
	const fetchedDefaultProduct = await findOneDefaultProductRepo({ match: { slug }, select: '' })
	return fetchedDefaultProduct
}

export const findDefaultProductsSrvc = async ({ page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyDefaultProducts = await findDefaultProductsRepo({ page, limit })
		return fetchedManyDefaultProducts
	} catch (err) {
		errorHandler({ err })
	}
}

export const createDefaultProductSrvc = async ({ name, slug, media, searchKeywords }) => {
	if (!slug) {
		slug = processSlug(name.en)
	}
	if (!media) {
		media = {}
		if (!media.thumbnail) {
			media.thumbnail = {}
			if (!media.thumbnail.url) {
				media.thumbnail.url = `${config.backend.url}/public/default-products/${slug}/thumbnail.jpeg`
			}
		}
	}
	return createDefaultProductRepo({ name, slug, media, searchKeywords })
}
