import mongoose from 'mongoose'
import { UserRefSchema } from '#users/schemas/user-ref.schema.js'

export const FilesSchema = new mongoose.Schema({
	user: { type: UserRefSchema, required: true },
	name: { type: String, required: true }, // name without extension
	originalname: { type: String, required: false }, // name + . + extension
	filename: { type: String, required: false }, // name + . + extension
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
})

export const FileRefSchema = new mongoose.Schema({
	name: { type: String, required: true }, // name without extension
	url: { type: String, required: true } //download file
})
export const filesCollection = 'files'
export const FileModel = mongoose.model(filesCollection, FilesSchema)
