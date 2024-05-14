import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {

    try {
        const lastWeekSum = await db.order.aggregate({
            where: {
                isPaid: true,
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
            _sum: {
                amount: true,
            },
        })
        return lastWeekSum;
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
