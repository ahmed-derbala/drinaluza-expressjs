const PRICE_UNIT = {
	KG: 'kg',
	L: 'l',
	PIECE: 'piece',
	TARA: 'tara'
}

export const priceUnitEnum = {
	values: Object.values(PRICE_UNIT),
	...PRICE_UNIT
}
