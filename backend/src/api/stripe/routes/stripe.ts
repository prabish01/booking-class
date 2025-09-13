export default {
  routes: [
    {
      method: "POST",
      path: "/stripe/create-checkout-session",
      handler: "stripe.createCheckoutSession",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/stripe/webhook",
      handler: "stripe.webhook",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
