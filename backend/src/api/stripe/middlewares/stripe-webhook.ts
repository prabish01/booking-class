export default () => {
  return async (ctx, next) => {
    console.log("-----------Stripe webhook middleware triggered for URL:", ctx.request.url);
    if (ctx.request.url === "/api/stripe/webhook" || ctx.request.url === "/api/stripe/webhook/") {
      if (ctx.request.method === "POST" && ctx.request.headers["stripe-signature"]) {
        try {
          const chunks = [];
          for await (const chunk of ctx.req) {
            chunks.push(chunk);
          }
          const rawBody = Buffer.concat(chunks);

          // Store the raw body for webhook verification
          ctx.state.rawBody = rawBody;

          console.log("Webhook middleware: Raw body captured", {
            length: rawBody.length,
            hasSignature: !!ctx.request.headers["stripe-signature"],
            contentType: ctx.request.headers["content-type"],
          });
        } catch (error) {
          console.error("Webhook middleware error:", error);
          ctx.status = 400;
          ctx.body = { error: "Failed to process webhook payload" };
          return; // Don't continue to next middleware
        }
      }
    }
    await next();
  };
};
