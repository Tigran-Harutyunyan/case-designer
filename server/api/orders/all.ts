import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {
    try {
        const orders = await db.order.findMany({
            where: {
                isPaid: true,
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                shippingAddress: true,
            },
        })
        return orders;
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
