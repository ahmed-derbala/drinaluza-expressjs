import mongoose from 'mongoose'
const Schema = mongoose.Schema
export default (function (c, options) {
	let f = null
	// Figure out if f is an object or a function, and take appropriate action
	if (typeof c === 'function') {
		f = new c()
	} else if (typeof f === 'object') {
		f = c
	} else {
		throw new TypeError('Class schema cannot work with that type. Whatever it was you supplied, probably a simple type. ')
	}
	let prop
	let o = {}
	// Save all the properties of f into a new object
	for (prop in f) {
		let p = f[prop]
		switch (p) {
			case String:
			case Number:
			case Date:
			case Buffer:
			case Boolean:
			case mongoose.Types.Mixed:
			case mongoose.Types.ObjectId:
			case Array:
				o[prop] = p
				break
			default:
				if (!typeof p === 'function') {
					o[prop] = p
				}
		}
	}
	// Create the schema
	let sch = new Schema(o, options)
	// Create the methods for the schema
	for (prop in f) {
		if (prop in f) {
			let func = f[prop]
			switch (func) {
				case String:
				case Number:
				case Date:
				case Buffer:
				case Boolean:
				case mongoose.Types.Mixed:
				case mongoose.Types.ObjectId:
				case Array:
					continue
			}
			if (typeof func === 'function') {
				sch.methods[prop] = func
			}
		}
	}
	return sch
})
