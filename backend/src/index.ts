// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const webhookPath = "/api/stripe/webhook/";

    // Add a custom middleware for Stripe webhooks
    strapi.server.app.use(async (ctx, next) => {
      if (ctx.path === webhookPath && ctx.method === "POST") {
        // Disable body parser for webhook requests
        ctx.disableBodyParser = true;

        // Get raw body for webhook
        const chunks = [];
        for await (const chunk of ctx.req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks);

        // Store raw body where the webhook handler can access it
        ctx.request.body = rawBody.toString("utf8");
        ctx.state.rawBody = rawBody;

        console.log("Webhook request received:", {
          path: ctx.path,
          method: ctx.method,
          bodyLength: rawBody.length,
          contentType: ctx.get("content-type"),
        });
      }
      await next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      // Set permissions for public access to content types
      const publicRole = await strapi.query("plugin::users-permissions.role").findOne({ where: { type: "public" } });

      if (publicRole) {
        // List of permissions to enable
        const permissionsToEnable = [
          "api::class-occurrence.class-occurrence.find",
          "api::class-occurrence.class-occurrence.findOne",
          "api::class-occurrence.class-occurrence.create",
          "api::class-occurrence.class-occurrence.update",
          "api::video.video.find",
          "api::video.video.findOne",
          "api::site-setting.site-setting.find",
        ];

        for (const action of permissionsToEnable) {
          // Check if permission exists
          const existingPermission = await strapi.query("plugin::users-permissions.permission").findOne({
            where: {
              role: publicRole.id,
              action: action,
            },
          });

          if (existingPermission) {
            // Update existing permission
            await strapi.query("plugin::users-permissions.permission").update({
              where: { id: existingPermission.id },
              data: { enabled: true },
            });
          } else {
            // Create new permission if it doesn't exist
            await strapi.query("plugin::users-permissions.permission").create({
              data: {
                action: action,
                role: publicRole.id,
                enabled: true,
              },
            });
          }
        }

        console.log("Public API permissions set successfully");
      }
    } catch (error) {
      console.log("Error setting permissions:", error.message);
    }
  },
};
