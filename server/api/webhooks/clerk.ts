import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {

    const { data, type: eventType } = await readBody(event);

    const { id, email_addresses, image_url, first_name, last_name, username, } = data;

    if (!id) {
        setResponseStatus(event, 403)
        return ''
    }

    try {

        if (eventType === "user.created") {

            const existingUser = await db.user.findFirst({
                where: { id },
            })

            if (!existingUser) {
                await db.user.create({
                    data: {
                        id: id,
                        email: email_addresses?.[0]?.email_address || '',
                    },
                })
            }

            return { success: true }
        }

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
