import { FileModel } from './files.schema.js'

export const createFilesSrvc = async ({ user, files }) => {
	if (!files) throw 'NO_FILE'
	//save url as path and name as original name without the extension
	files.forEach((file) => {
		file.url = file.path
		file.name = file.originalname.split('.')[0]
		file.extension = file.originalname.split('.')[1]
		file.user = user
	})
	const createdFiles = await FileModel.insertMany(files)

	return createdFiles
}
