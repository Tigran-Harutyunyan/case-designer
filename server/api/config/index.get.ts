import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {
    const { id } = await getQuery(event);

    try {
        const configuration = await db.configuration.findUnique({
            where: { id },
        })

        return configuration;

    } catch (error) {
        console.log("[CONFIG_GET]", error);
        if (error instanceof Error) {
            return createError({
                statusCode: 500,
                statusMessage: error.message
            });
        }
    }

});