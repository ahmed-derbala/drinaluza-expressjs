const makeHomeCardItemFromProduct = ({ product }) => {
	product.cardType = 'product'
	return product
}

module.exports.makeHomeCards = ({ products, shops, users, posts, news }) => {
	let homeCards = []
	if (products && products.length > 0) {
		products = products.map((product) => {
			product = makeHomeCardItemFromProduct({ product })
			return product
		})
		homeCards = homeCards.concat(products)
	}
	return homeCards
}
