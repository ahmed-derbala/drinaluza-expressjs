import mongoose from 'mongoose'

const UNIT = {
	KG: 'kg',
	PIECE: 'piece',
	TARA: 'tara'
}

export const UNITS = Object.values(UNIT)

export const UnitSchema = new mongoose.Schema(
	{
		measure: {
			type: String,
			required: true,
			enum: UNITS,
			default: UNIT.KG
		},
		min: {
			//when the seller wants a minimum quantity to sell
			type: Number,
			required: true,
			default: 1,
			min: 0.01
		},
		max: {
			type: Number,
			required: true,
			default: 10,
			min: 0.01
		}
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
