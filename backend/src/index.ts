// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

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

        console.log("✅ Public API permissions set successfully");
      }
    } catch (error) {
      console.log("⚠️ Error setting permissions:", error.message);
    }
  },
};
