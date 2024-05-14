import { db } from '@/lib/prismadb';
import Stripe from "stripe";
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { type Order } from '@/types'

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;
const APP_URL = useRuntimeConfig().public.appUrl as string;

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2024-04-10",
    typescript: true,
});

import { clerkClient } from 'h3-clerk';

export default defineEventHandler(async (event) => {
    const { configId } = await readBody(event);
    const { auth } = event.context;
    const userId = auth?.userId;

    if (!userId) {
        return createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        })
    };

    const user = await clerkClient.users.getUser(userId);

    const configuration = await db.configuration.findUnique({
        where: { id: configId as string },
    })

    if (!configuration) {
        return createError({
            statusCode: 500,
            statusMessage: 'No such configuration found'
        })
    }

    const { finish, material } = configuration;

    let price = BASE_PRICE;
    if (finish === 'textured') price += PRODUCT_PRICES.finish.textured;
    if (material === 'polycarbonate')
        price += PRODUCT_PRICES.material.polycarbonate;

    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where: {
            userId: user.id,
            configurationId: configuration.id,
        },
    });

    if (existingOrder) {
        order = existingOrder
    } else {
        order = await db.order.create({
            data: {
                amount: price / 100,
                userId: user.id,
                configurationId: configuration.id,
            },
        })
    }


    const product = await stripe.products.create({
        name: 'Custom iPhone Case',
        images: [configuration.imageUrl],
        default_price_data: {
            currency: 'USD',
            unit_amount: price,
        },
    })


    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${APP_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${APP_URL}/configure/preview?id=${configuration.id}`,
        payment_method_types: ['card'],
        mode: 'payment',
        shipping_address_collection: { allowed_countries: ['DE', 'US'] },
        metadata: {
            userId: user.id,
            orderId: order.id,
        },
        line_items: [{ price: product.default_price as string, quantity: 1 }],
    })

    return { url: stripeSession.url }

});
