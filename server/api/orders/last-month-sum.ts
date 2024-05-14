import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {

    try {
        const lastMonthSum = await db.order.aggregate({
            where: {
                isPaid: true,
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                },
            },
            _sum: {
                amount: true,
            },
        })
        return lastMonthSum;
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
