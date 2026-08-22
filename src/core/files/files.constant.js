export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/webp', 'image/png', 'image/heic', 'image/heif']

export const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov']
export const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export const ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS]
export const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_VIDEO_MIME_TYPES]

export const filesCollection = 'files'
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
export const MAX_FILE_COUNT = 5
