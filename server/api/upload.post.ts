import { db } from '@/lib/prismadb';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
    const { url, configId, color, finish, material, model } = await readBody(event);

    const res = await fetch(url)
    const buffer = await res.arrayBuffer()

    const imgMetadata = await sharp(buffer).metadata()
    const { width, height } = imgMetadata

    try {

        if (!configId) {
            const configuration = await db.configuration.create({
                data: {
                    imageUrl: url,
                    height: height || 500,
                    width: width || 500,
                },
            })

            return { configId: configuration.id }
        } else {

            let data: {
                [key: string]: string
            } = {};

            if (url && typeof url === 'string') {
                data.croppedImageUrl = url
            }
            if (model && typeof model === 'string') {
                data.model = model
            }
            if (material && typeof material === 'string') {
                data.material = material
            }
            if (finish && typeof finish === 'string') {
                data.finish = finish
            }
            if (color && typeof color === 'string') {
                data.color = color
            }

            const updatedConfiguration = await db.configuration.update({
                where: {
                    id: configId,
                },
                data
            })

            return { configId: updatedConfiguration.id }
        }
    } catch (error) {
        if (error instanceof Error) {
            return createError({
                statusCode: 500,
                statusMessage: error.message
            });
        }
    }

});