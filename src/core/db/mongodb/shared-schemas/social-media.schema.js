import mongoose from 'mongoose'

export const SocialMediaSchema = new mongoose.Schema(
	{
		facebook: {
			url: { type: String, required: false },
			username: { type: String, required: false }
		},
		instagram: {
			url: { type: String, required: false },
			username: { type: String, required: false }
		}
	},
	{ _id: false }
)
