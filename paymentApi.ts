import { Request, Response } from "express";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51QYvgyRq466RrrrAVlBqoNyJbqYfiCeDEBeIWagESw9Sgnr4uPoduNte3HnUA8FUmudXsJmstsT39gzDTgfdBLKD00aJ8Jop5Y"
);
const createPayment = async (req: Request, res: Response) => {
  const amount = 10 * 100; // real amount and 100 for cent to dollar
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const PaymentService = {
  createPayment,
};
