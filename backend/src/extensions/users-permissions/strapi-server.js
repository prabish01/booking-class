module.exports = (plugin) => {
  console.log("🔧 Loading custom users-permissions extension...");

  // Extend the register controller to accept additional fields
  const originalRegister = plugin.controllers.auth.register;
  console.log("📝 Original register function exists:", typeof originalRegister);

  plugin.controllers.auth.register = async (ctx) => {
    console.log("🚀 Custom register function called!");
    console.log("📝 Request body received:", ctx.request.body);
    const pluginStore = await strapi.store({ type: "plugin", name: "users-permissions" });
    const settings = await pluginStore.get({ key: "advanced" });

    if (!settings.allow_register) {
      return ctx.badRequest("Register action is currently disabled");
    }

    const params = {
      ...ctx.request.body,
    };

    console.log("📝 Registration params received:", params);

    // Extract additional fields
    const additionalFields = {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      address: params.address,
      dateOfBirth: params.dateOfBirth,
      gender: params.gender,
      heardAboutUs: params.heardAboutUs,
    };

    console.log("📝 Additional fields extracted:", additionalFields);

    // Remove additional fields from params for the original registration
    delete params.firstName;
    delete params.lastName;
    delete params.phone;
    delete params.address;
    delete params.dateOfBirth;
    delete params.gender;
    delete params.heardAboutUs;

    // Set the modified params back to the request body
    ctx.request.body = params;

    console.log("📝 Modified params for original registration:", params);

    // Call the original register function
    await originalRegister(ctx);

    // If registration was successful, update the user with additional fields
    if (ctx.body && ctx.body.user && ctx.body.user.id) {
      try {
        console.log("✅ Registration successful, updating user with additional fields");

        // Filter out null/undefined values
        const fieldsToUpdate = {};
        Object.keys(additionalFields).forEach((key) => {
          if (additionalFields[key] !== null && additionalFields[key] !== undefined && additionalFields[key] !== "") {
            fieldsToUpdate[key] = additionalFields[key];
          }
        });

        console.log("� Fields to update:", fieldsToUpdate);

        if (Object.keys(fieldsToUpdate).length > 0) {
          const updatedUser = await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: ctx.body.user.id },
            data: fieldsToUpdate,
          });

          console.log("✅ User updated with additional fields:", updatedUser);

          // Update the response with the complete user data
          ctx.body.user = { ...ctx.body.user, ...fieldsToUpdate };
        }
      } catch (error) {
        console.error("❌ Error updating user with additional fields:", error);
        // Don't fail the registration if additional fields update fails
      }
    }
  };

  // Add the /users/me GET endpoint for fetching current user
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/users/me",
    handler: "user.me",
    config: {
      policies: [],
      middlewares: [],
    },
  });

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized("You must be authenticated to access this resource.");
    }

    try {
      const user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: { id: ctx.state.user.id },
        populate: true,
      });

      if (!user) {
        return ctx.notFound("User not found");
      }

      // Remove sensitive data
      delete user.password;
      delete user.resetPasswordToken;
      delete user.confirmationToken;

      ctx.body = user;
    } catch (error) {
      console.error("Error fetching user:", error);
      ctx.internalServerError("Unable to fetch user");
    }
  };

  console.log("✅ Custom users-permissions extension loaded successfully");
  return plugin;
};
