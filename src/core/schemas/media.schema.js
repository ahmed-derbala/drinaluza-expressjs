import { FileRefSchema } from '#core/files/schemas/files-ref.schema.js'

export const MediaSchema = {
	_id: false,
	thumbnail: FileRefSchema,
	gallery: [FileRefSchema]
}
