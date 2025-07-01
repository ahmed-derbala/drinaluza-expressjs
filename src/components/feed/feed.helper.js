const makeFeedCardItemFromProduct = ({ product }) => {
	product.cardType = 'product'
	return product
}
export const makeFeedCards = ({ products, shops, users, posts, news }) => {
	let feedCards = []
	if (products && products.length > 0) {
		products = products.map((product) => {
			product = makeFeedCardItemFromProduct({ product })
			return product
		})
		feedCards = feedCards.concat(products)
	}
	return feedCards
}
