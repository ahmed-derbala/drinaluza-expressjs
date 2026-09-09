import { createEnum } from '#enum'

export const usersCollection = 'users'
export const USER_ROLES_ALL = ['customer', 'business_owner', 'manager', 'super']
export const USER_ROLES = createEnum(...USER_ROLES_ALL)
