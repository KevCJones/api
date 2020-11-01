import { APIGatewayProxyEvent } from 'aws-lambda';
import Stripe from 'stripe';
import { calculateCost } from '../../libs/billing-lib';
import handler from '../../libs/handler-lib';

const stripe = new Stripe(process.env.stripeSecretKey, {
  apiVersion: '2020-08-27',
  typescript: true,
});

//found this after this code - https://itnext.io/stripe-react-and-serverless-part-1-3482e9332b4c

export const main = handler(async (event: APIGatewayProxyEvent, context: any) => {
  const { items } = JSON.parse(event.body);

  const amount = calculateCost(items);
  // Create a PaymentIntent with the order amount and currency.
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency: 'gbp',
    // eslint-disable-next-line
    payment_method_types: ['card'],
    // eslint-disable-next-line
    statement_descriptor: 'Custom descriptor',
  };

  // Create the payment intent
  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);

  // Send publishable key and PaymentIntent client_secret to client.
  return {
    clientSecret: paymentIntent.client_secret,
    publishableKey: process.env.stripePublishableKey,
    amount,
  };
});
