"use client";
import { useEffect, useState } from "react";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QYvgyRq466RrrrAdipSYJ1sVqmfyv3xArerQnMag3gPpP0OelLcJrhlQCVh0J16JpRSdLBIe5CUf7yY1X5Ie6qM00UqggC9po"
);

export default function Payment({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/payment/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance: Appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          {children}
        </Elements>
      )}
    </div>
  );
}
