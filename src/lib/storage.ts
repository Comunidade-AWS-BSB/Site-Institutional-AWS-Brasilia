import { getUrl, uploadData } from 'aws-amplify/storage'
import { useFileStore } from '@/stores/file.store'

import { EVENTS_PREFIX } from '@/constants/storage'

export async function uploadImage(file: File, keyPrefix = EVENTS_PREFIX): Promise<string | undefined> {
    const store = useFileStore()
    store.progress = 0
    store.loading = true

    const objectKey = `${keyPrefix}${crypto.randomUUID()}-${file.name}`
    try {
        await uploadData({
            data: file,
            path: objectKey,
            options: {
                contentType: file.type,
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        store.progress = Math.round(
                            (transferredBytes / totalBytes) * 100
                        )
                    }
                }
            }
        }).result
    } catch (error: unknown) {
        store.error = true
        console.log("[STORAGE]: Error ao fazer upload de arquivo: ", error)
    } finally {
        store.loading = false
        return objectKey
    }
}

export async function getPublicImageUrl(objectKey: string) {
    return await getUrl({
        path: objectKey,
        options: {
            expiresIn: 5400 // 1h30
        }
    })
}
