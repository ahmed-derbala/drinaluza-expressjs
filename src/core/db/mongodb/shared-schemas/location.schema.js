import mongoose from 'mongoose'

export const LocationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['Point'],
			required: false, // If location exists, type MUST be Point
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			required: false, // If location exists, coordinates MUST be present
			validate: {
				validator: function (value) {
					return Array.isArray(value) && value.length === 2
				},
				message: 'Coordinates must be an array of [longitude, latitude].'
			}
		},
		sharingEnabled: {
			type: Boolean,
			default: false
		}
	},
	{ _id: false, timestamps: true } // Added _id: false to avoid unnecessary sub-document IDs
)

// Define the 2dsphere index directly on the coordinates path
LocationSchema.index({ coordinates: '2dsphere' }, { sparse: true })
