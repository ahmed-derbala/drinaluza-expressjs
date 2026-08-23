import { createFileRepo, saveThumbnailMediaFileRepo, saveGalleryMediaFileRepo } from './files.repository.js'
import { log } from '#core/log/index.js'

export const createFilesSrvc = async ({ user, files, targetModelName, targetModelId }) => {
	//log({ level: 'debug', label: 'createFilesSrvc', data: { files } })

	let result = { message: 'unknown error', data: [] }
	if (!files || Object.keys(files).length === 0) {
		result.message = 'NO_FILE_PROVIDED'
		result.data = null
		return result
	}
	let createdFile = {}
	//save url as path and name as original name without the extension
	if (files.thumbnail) {
		//files.thumbnail is an aray of 1
		for (const [index, file] of files.thumbnail.entries()) {
			createdFile = {}
			file.user = user
			file.size ??= file.bytes
			file.targetModels = [{ targetModelName, targetModelId, targetModelMediaField: 'thumbnail' }]
			createdFile = await createFileRepo({ file })
			if (createdFile) {
				result.message = 'Files uploaded successfully'
				result.data.push(createdFile)
				processThumbnailMediaFileSrvc({ file: createdFile, targetModelName, targetModelId })
			}
		}
	}
	if (files.gallery) {
		for (const [index, file] of files.gallery.entries()) {
			createdFile = {}
			file.user = user
			file.size ??= file.bytes
			file.targetModels = [{ targetModelName, targetModelId, targetModelMediaField: 'gallery' }]
			createdFile = await createFileRepo({ file })
			if (createdFile) {
				result.message = 'Files uploaded successfully'
				result.data.push(createdFile)
				processGalleryMediaFileSrvc({ file: createdFile, targetModelName, targetModelId })
			}
		}
	}
	return result
}

const processThumbnailMediaFileSrvc = async ({ file, targetModelName, targetModelId }) => {
	/**
	 * cloudinary delete api here
	 */

	saveThumbnailMediaFileRepo({ file, targetModelName, targetModelId })
}

const processGalleryMediaFileSrvc = async ({ file, targetModelName, targetModelId }) => {
	/**
	 * cloudinary delete api here
	 */

	saveGalleryMediaFileRepo({ file, targetModelName, targetModelId })
}
