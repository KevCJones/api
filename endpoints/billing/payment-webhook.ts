import { APIGatewayProxyEvent } from 'aws-lambda';
import Stripe from 'stripe';
import handler from '../../libs/handler-lib';

export const main = handler(async (event: APIGatewayProxyEvent, context: any) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let stripeEvent: Stripe.Event;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers['stripe-signature'],
      process.env.stripeSecretKey
    );
  } catch (err) {
    throw new Error('Webhook signature verification failed.');
  }

  // Extract the data from the event.
  const data: Stripe.Event.Data = stripeEvent.data;
  const eventType: string = stripeEvent.type;

  if (eventType === 'payment_intent.succeeded') {
    // Cast the event into a PaymentIntent to make use of the types.
    const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
  } else if (eventType === 'payment_intent.payment_failed') {
    // Cast the event into a PaymentIntent to make use of the types.
    const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
  }

  return { status: true };
});
