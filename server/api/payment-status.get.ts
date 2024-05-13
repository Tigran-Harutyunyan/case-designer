import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {
    const { auth } = event.context;
    const { orderId } = await getQuery(event);

    if (!(auth?.userId)) {
        return createError({
            statusCode: 500,
            statusMessage: 'You need to be logged in to view this page.'
        })
    }

    try {
        const order = await db.order.findFirst({
            where: { id: orderId as string, userId: auth?.userId },
            include: {
                billingAddress: true,
                configuration: true,
                shippingAddress: true,
                user: true,
            },
        })

        if (!order) throw new Error('This order does not exist.')

        if (order.isPaid) {
            return order
        } else {
            return false
        }
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
