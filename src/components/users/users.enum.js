const CUSTOMER = 'customer',
	SHOP_OWNER = 'shop_owner',
	SUPER_ADMIN = 'super'

export const userRolesEnum = {
	CUSTOMER,
	SHOP_OWNER,
	SUPER_ADMIN,
	ALL: [CUSTOMER, SHOP_OWNER, SUPER_ADMIN]
}
