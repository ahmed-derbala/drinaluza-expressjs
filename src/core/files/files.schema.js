import mongoose from 'mongoose'
import { CreatedByUserSchema } from '../../components/users/users.schema.js'

export const FilesSchema = new mongoose.Schema(
	{
		createdByUser: { type: CreatedByUserSchema, required: true },
		name: { type: String, required: true }, // name without extension
		originalname: { type: String, required: false }, // name + . + extension
		extension: { type: String, required: false }, // the extension prefixed with a dot
		url: { type: String, required: true }, //download file
		path: { type: String, required: false }, //local file path
		encoding: { type: String, required: false },
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
		] //if the file is associated to multiple models , kind refers to collections. makes it so easy to share the same file between multiple collections
	},
	{ timestamps: true }
)

export const FileRefSchema = new mongoose.Schema({
	createdByUser: { type: CreatedByUserSchema, required: true },
	name: { type: String, required: true }, // name without extension
	originalname: { type: String, required: false }, // name + . + extension
	extension: { type: String, required: false }, // the extension prefixed with a dot
	url: { type: String, required: true }, //download file
	path: { type: String, required: false }, //local file path
	encoding: { type: String, required: false },
	mimetype: String,
	size: Number // in bytes, 1 million ~ 1 mb
})
export const filesCollection = 'files'
export const FileModel = mongoose.model(filesCollection, FilesSchema)
