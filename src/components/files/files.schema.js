const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: { type: String, required: true }, // name without extension
		url: { type: String, required: true }, //download file
		path: { type: String, required: false }, //local file path
		encoding: { type: String, required: false },
		originalname: { type: String, required: false }, // name + . + extension
		extension: { type: String, required: false }, // the extension prefixed with a dot
		tag: { type: String, required: false }, // a string to identify the source or where the file is displayed in front (source)
		mimetype: String,
		size: Number, // in bytes, 1 million ~ 1 mb
		linkedData: [
			{
				kind: String, //name of the associated collection, schema name
				kindId: {
					type: mongoose.Schema.Types.ObjectId,
					refPath: 'linkedData.kind'
				},
				kindTag: {
					type: String
				}
			}
		], //if the file is associated to multiple models , kind refers to collections. makes it so easy to share the same file between multiple collections
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		}
	},
	{ timestamps: true }
)

const filesCollection = 'files'

module.exports = {
	FilesModel: mongoose.model(filesCollection, schema),
	filesCollection
}
