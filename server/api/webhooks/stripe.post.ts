import Stripe from "stripe";
import { defineStripeWebhook } from '@fixers/nuxt-stripe/server';
import { Resend } from 'resend'
import { db } from '@/lib/prismadb';
import { useCompiler } from '#vue-email'
/**
* @param event - the H3 event
* @param stipe - the Stripe instance
* @param stripeEvent - the Stripe Webhook event
*/

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;

const WEBHOOK_SECRET = useRuntimeConfig().stripeWebhookSecret;

const RESEND_API_KEY = useRuntimeConfig().resendApi;

const resend = new Resend(RESEND_API_KEY);

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2024-04-10"
});

const webhookOptions = {
    webhookSecret: WEBHOOK_SECRET,
    stripe,
}

export default defineStripeWebhook(async ({ event, stripeEvent }) => {

    if (!isMethod(event, ['POST'])) {
        setResponseStatus(event, 400)

        return { ok: false }
    }

    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    switch (stripeEvent.type) {
        case 'checkout.session.completed': {

            if (!stripeEvent.data.object.customer_details?.email) {
                throw new Error('Missing user email')
            }

            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            }

            if (!userId || !orderId) {
                throw new Error('Invalid request metadata')
            }

            const billingAddress = session.customer_details!.address
            const shippingAddress = session.shipping_details!.address

            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            street: shippingAddress!.line1!,
                            state: shippingAddress!.state,
                        },
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            street: billingAddress!.line1!,
                            state: billingAddress!.state,
                        },
                    },
                },
            })

            const template = await useCompiler('OrderReceivedEmail.vue', {
                props: {
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString(),
                    baseUrl: useRuntimeConfig().public.appUrl,
                    // @ts-ignore
                    shippingAddress: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postal_code!,
                        street: shippingAddress!.line1!,
                        state: shippingAddress!.state,
                    },
                }
            })

            const data = await resend.emails.send({
                from: 'CaseCobra <hello@case-designer.com>',
                to: [stripeEvent.data.object.customer_details.email],
                subject: 'Thanks for your order!',
                html: template.html,
            })

            console.log(data)
        }
    }

    return { result: event, ok: true }

}, webhookOptions); 
