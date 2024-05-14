export default defineEventHandler(async (event) => {
    const { auth } = event.context;

    if (!(auth?.userId)) {
        return false
    }

    try {
        return auth.userId === useRuntimeConfig().adminId
    } catch (error: unknown) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
