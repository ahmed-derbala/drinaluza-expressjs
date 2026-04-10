import mongoose from 'mongoose'
export const PhoneSchema = {
	fullNumber: { type: String, required: false },
	countryCode: { type: String, required: false },
	localNumber: { type: String, required: false }
}
