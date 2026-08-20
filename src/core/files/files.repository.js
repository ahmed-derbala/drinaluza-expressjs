import mongoose from 'mongoose'
import { FileModel } from './files.schema.js'

export const createFileRepo = async ({ file }) => {
	return FileModel.create(file)
}

export const saveThumbnailMediaFileRepo = async ({ file, targetModelName, targetModelId }) => {
	const TargetModelName = mongoose.model(targetModelName)
	const targetModeldata = await TargetModelName.findByIdAndUpdate(targetModelId, { $set: { 'media.thumbnail': file } }, { returnDocument: 'after' })
	return targetModeldata
}

export const saveGalleryMediaFileRepo = async ({ file, targetModelName, targetModelId }) => {
	const TargetModelName = mongoose.model(targetModelName)
	const targetModeldata = await TargetModelName.findByIdAndUpdate(targetModelId, { $push: { 'media.gallery': file } }, { returnDocument: 'after' })
	return targetModeldata
}
