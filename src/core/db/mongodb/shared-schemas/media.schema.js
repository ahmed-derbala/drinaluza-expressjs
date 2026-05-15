import { FileRefSchema } from '#core/files/schemas/files-ref.schema.js'

export const MediaSchema = {
	/*thumbnail: {
		url: { type: String, required: true, default: `${config.backend.url}/public/favicon.ico` }
	}*/
	thumbnail: FileRefSchema
}
