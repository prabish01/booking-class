const express = require("express");

const app = express();

app.post("/api/stripe/webhook", async (req, res) => {
  console.log("Stripe..........................");
    console.log("🔥 WEBHOOK ENDPOINT HIT! 🔥", {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
    });

    const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString("utf8");

      // Log it to check
      console.log("🔍 Raw body:", rawBody);
    res.status(200).send("Webhook received");
});

app.listen(1337, () => {
  console.log("Server is running on http://localhost:3000");
});