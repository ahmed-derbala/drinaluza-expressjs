import mongoose from 'mongoose'
import { UserRefSchema } from '#users/schemas/user-ref.schema.js'
import { filesCollection } from './files.constant.js'

export const FilesSchema = new mongoose.Schema(
	{
		user: { type: UserRefSchema, required: true },
		originalname: { type: String, required: true },
		mimetype: String,
		size: { type: Number, required: false }, // in bytes, 1 million ~ 1 mb
		asset_id: String,
		public_id: String,
		width: Number,
		height: Number,
		format: String, //extension without dot
		resource_type: { type: String, required: false }, //image, video
		url: { type: String, required: true }, //download or display file
		secure_url: { type: String, required: false }, //download or display file over https
		playback_url: { type: String, required: false }, //Adaptive Bitrate Streaming video playback over https
		duration: Number,
		asset_folder: String,
		access_mode: String,
		targetModels: {
			_id: false,
			type: [
				{
					targetModelName: String, //name of the associated collection
					targetModelId: {
						type: mongoose.Schema.Types.ObjectId,
						refPath: 'targetModels.targetModelName'
					},
					targetModelMediaField: {
						type: String,
						enum: ['thumbnail', 'gallery'],
						default: 'thumbnail'
					}
				}
			],
			select: false
		}
	},
	{ timestamps: true }
)

export const FileModel = mongoose.model(filesCollection, FilesSchema)
