export const ALLOWED_EXTENSIONS = {
	image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
	document: ['.pdf', '.doc', '.docx', '.pdf'],
	video: ['.mp4', '.mkv', '.mov']
}
export const ALLOWED_EXTENSIONS_ALL = Object.values(ALLOWED_EXTENSIONS).flat()

export const filesCollection = 'files'
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_FILE_COUNT = 5
