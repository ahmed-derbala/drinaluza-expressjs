import mongoose from 'mongoose'
import { usersCollection } from '../users/users.schema.js'
const BusinessRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: [true, 'business._id is required']
		},
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: true }
)
export { BusinessRefSchema }
export default {
	BusinessRefSchema
}
