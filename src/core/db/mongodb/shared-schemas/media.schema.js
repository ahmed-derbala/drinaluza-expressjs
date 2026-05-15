import { FileRefSchema } from '#core/files/files.schema.js'

export const MediaSchema = {
	/*thumbnail: {
		url: { type: String, required: true, default: `${config.backend.url}/public/favicon.ico` }
	}*/
	thumbnail: FileRefSchema
}
