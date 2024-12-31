import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/payment/compleate",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error?.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      <div className="space-y-4">
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
          className="w-full px-4 py-2 rounded-lg"
        />
      </div>

      <div className="flex justify-center">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold focus:outline-none transition-all ease-in-out duration-300 ${
            isLoading || !stripe || !elements
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
        >
          <span id="button-text">
            {isLoading ? (
              <div
                className="spinner animate-spin mx-auto text-white"
                id="spinner"
              ></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
      </div>

      {/* Error or Success Messages */}
      {message && (
        <div
          id="payment-message"
          className="text-center text-red-500 font-medium"
        >
          {message}
        </div>
      )}
    </form>
  );
}
