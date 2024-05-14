import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {
    const { auth } = event.context;
    const { id, newStatus } = await readBody(event);

    if (!(auth?.userId)) {
        return createError({
            statusCode: 500,
            statusMessage: 'You need to be logged in to view this page.'
        })
    }

    try {
        const response = await db.order.update({
            where: { id },
            data: { status: newStatus },
        })
        return { response }
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
