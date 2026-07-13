import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator

export const patchMyProfileVld = [
	body('name').isObject().optional(),
	body('address').isObject().optional(),
	body('settings').isObject().optional(),
	// 1. Mark the top-level location object as optional
	body('location').optional({ values: 'falsy' }).isObject().withMessage('Location must be an object'),
	// 2. Validate GeoJSON structure if location is present
	body('location.geo').optional({ values: 'falsy' }).isObject().withMessage('Geo must be an object'),
	body('location.geo.type')
		.if(body('location.geo').exists()) // Only validate if geo object exists
		.equals('Point')
		.withMessage('Geo type must be "Point"'),

	body('location.geo.coordinates')
		.if(body('location.geo').exists())
		.isArray({ min: 2, max: 2 })
		.withMessage('Coordinates must be an array of exactly 2 numbers')
		.custom((value) => {
			const [lng, lat] = value
			if (typeof lng !== 'number' || typeof lat !== 'number') {
				throw new Error('Coordinates must be numbers')
			}
			if (lng < -180 || lng > 180) {
				throw new Error('Longitude must be between -180 and 180')
			}
			if (lat < -90 || lat > 90) {
				throw new Error('Latitude must be between -90 and 90')
			}
			return true
		}),

	// 3. Validate Expo Metadata fields
	body('location.accuracy').optional({ values: 'null' }).isNumeric().withMessage('Accuracy must be a number'),

	body('location.heading').optional({ values: 'null' }).isNumeric().withMessage('Heading must be a number'),

	body('location.speed').optional({ values: 'null' }).isNumeric().withMessage('Speed must be a number'),

	body('location.altitude').optional({ values: 'null' }).isNumeric().withMessage('Altitude must be a number'),

	body('location.sharingEnabled').optional().isBoolean().withMessage('sharingEnabled must be a boolean')
]
