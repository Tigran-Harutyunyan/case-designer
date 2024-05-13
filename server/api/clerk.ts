import { clerkClient } from 'h3-clerk';
import { db } from '@/lib/prismadb';

export default defineEventHandler(async (event) => {

    const { data, type: eventType } = await readBody(event);



    const { auth } = event.context;

    if (!(auth?.userId)) {
        return createError({
            statusCode: 500,
            statusMessage: 'You need to be logged in to view this page.'
        })
    }
    return auth.userId;
    const user = await clerkClient.users.getUser(auth?.userId);


    try {

        if (eventType === "user.created") {
            const { id, email_addresses, image_url, first_name, last_name, username } = data;

            if (!user?.id) {
                throw new Error('Invalid user data')
            }

            const existingUser = await db.user.findFirst({
                where: { id: user.id },
            })

            if (!existingUser) {
                await db.user.create({
                    data: {
                        id: user.id,
                        email: user.email,
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
