import { promisify } from 'util'

const cloudinary = require('cloudinary')
const { urlExists } = require('url-exists-promise')

// Only supporting mp4 for now.
const videoExtensions = ['mp4']

interface CloudinaryConfig {
    cloud_name: string
    api_key: string
    api_secret: string
}

export const isVideo = (localAbsolutePath: string) => {
    for (let i = 0; i < videoExtensions.length; i++) {
        const extension = videoExtensions[i]
        if (localAbsolutePath.endsWith(extension)) return true
    }
    return false
}

const uploadPromised = promisify(cloudinary.v2.uploader.upload)

export const uploadFile = (id: string, localAbsolutePath: string) =>
    uploadPromised(localAbsolutePath, {
        public_id: id,
        resource_type: isVideo(localAbsolutePath) ? 'video' : 'image',
    })

const uploadExplicitPromised = promisify(cloudinary.v2.uploader.explicit)

export const getMetadata = (id: string, localAbsolutePath: string) =>
    uploadExplicitPromised(id, {
        image_metadata: true,
        type: 'upload',
        resource_type: isVideo(localAbsolutePath) ? 'video' : 'image',
    })

export const imageExists = (id: string, config: CloudinaryConfig) => {
    const urlImg = `http://res.cloudinary.com/${
        config.cloud_name
    }/image/upload/${id}`
    return urlExists(urlImg)
}

export const videoExists = (id: string, config: CloudinaryConfig) => {
    const urlVideo = `http://res.cloudinary.com/${
        config.cloud_name
    }/video/upload/${id}`
    return urlExists(urlVideo)
}

export const fileExists = async (
    id: string,
    localAbsolutePath: string,
    config: CloudinaryConfig,
) => {
    if (isVideo(localAbsolutePath)) {
        return videoExists(id, config)
    }
    return imageExists(id, config)
}

export const uploadOrGetMetadata = async (
    id: string,
    localAbsolutePath: string,
    config: CloudinaryConfig,
) => {
    const exists = await fileExists(id, localAbsolutePath, config)
    if (!exists) {
        // Have to upload the image or video
        return uploadFile(id, localAbsolutePath)
    } else {
        // Already uploaded, we just get the metadata
        return await getMetadata(id, localAbsolutePath)
    }
}
