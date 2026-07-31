import mongoose from 'mongoose'

const UNIT = {
	KG: 'kg',
	PIECE: 'piece',
	CRATE: 'crate'
}

export const UNITS = Object.values(UNIT)

export const UnitSchema = {
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
	},
	step: {
		//the value by which the quantity can be increased or decreased
		type: Number,
		required: true,
		default: 1,
		min: 0.01
	},
	singlePiece: {
		maxWeightKg: {
			type: Number,
			required: false,
			min: 0.01,
			validate: {
				validator: function (v) {
					// If max is set, avg must be <= max and >= min
					if (!v) return true
					if (this.minWeightKg && v < this.minWeightKg) return false
					if (this.avgWeightKg && v < this.avgWeightKg) return false
					return true
				},
				message: 'Maximum weight must be greater than or equal to average and minimum weight.'
			}
		},
		avgWeightKg: {
			type: Number,
			required: false,
			min: 0.01,
			validate: {
				validator: function (v) {
					// If max is set, avg must be <= max and >= min
					if (!v) return true
					if (this.minWeightKg && v < this.minWeightKg) return false
					if (this.maxWeightKg && v > this.maxWeightKg) return false
					return true
				},
				message: 'Average weight must be between minimum and maximum weight.'
			}
		},
		minWeightKg: {
			type: Number,
			required: false,
			min: 0.01,
			validate: {
				validator: function (v) {
					// If max is set, avg must be <= max and >= min
					if (!v) return true
					if (this.avgWeightKg && v > this.avgWeightKg) return false
					if (this.maxWeightKg && v > this.maxWeightKg) return false
					return true
				},
				message: 'Minimum weight must be less than or equal to average and maximum weight.'
			}
		}
	}
}
