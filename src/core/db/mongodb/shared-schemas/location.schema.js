import mongoose from 'mongoose'

export const LocationSchema = new mongoose.Schema(
	{
		// Wrap GeoJSON in a sub-document or handle it cleanly
		geo: {
			type: {
				type: String,
				enum: ['Point'],
				required: function () {
					return this.geo?.coordinates?.length > 0
				}
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
				required: function () {
					return this.geo?.type === 'Point'
				},
				validate: {
					validator: function (value) {
						if (!value) return true // Let required handle empty states
						const [lng, lat] = value
						return (
							Array.isArray(value) &&
							value.length === 2 &&
							lng >= -180 &&
							lng <= 180 && // Longitude bounds
							lat >= -90 &&
							lat <= 90 // Latitude bounds
						)
					},
					message: 'Coordinates must be a valid array of [longitude, latitude].'
				}
			}
		},
		// Store useful metadata that Expo gives you
		accuracy: { type: Number },
		heading: { type: Number },
		speed: { type: Number },
		altitude: { type: Number },
		sharingEnabled: {
			type: Boolean,
			default: false
		}
	},
	{ _id: false, timestamps: true }
)

// Index the geo field for geospatial queries
LocationSchema.index({ 'geo.coordinates': '2dsphere' }, { sparse: true })
