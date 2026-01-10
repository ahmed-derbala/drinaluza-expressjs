import mongoose from 'mongoose'

export const LocationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['Point'], // only allow 'Point'
			required: false,
			default: 'Point'
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: false,
			validate: {
				validator: function (value) {
					return value.length === 2
				},
				message: 'Coordinates must be an array of [longitude, latitude].'
			}
		}
	},
	{ _id: false }
)

// Create 2dsphere index for geospatial queries
LocationSchema.index({ coordinates: '2dsphere' })
