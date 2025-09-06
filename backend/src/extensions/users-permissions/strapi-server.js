module.exports = (plugin) => {
  console.log("🔧 Loading custom users-permissions extension...");

  // Completely override the register controller
  plugin.controllers.auth.register = async (ctx) => {
    console.log("📝 Custom register controller called with:", ctx.request.body);

    const { username, email, password, first_name, last_name, phone, address, date_of_birth, gender, hear_about_us } = ctx.request.body;

    try {
      // Validate required fields
      if (!username || !email || !password || !first_name || !last_name || !phone || !address || !date_of_birth || !gender || !hear_about_us) {
        return ctx.badRequest("All fields are required");
      }

      // Check if registration is enabled
      const pluginStore = await strapi.store({ type: "plugin", name: "users-permissions" });
      const settings = await pluginStore.get({ key: "advanced" });

      if (!settings.allow_register) {
        return ctx.badRequest("Register action is currently disabled");
      }

      // Check if user already exists
      const existingUser = await strapi.query("plugin::users-permissions.user").findOne({
        where: {
          $or: [{ email: email.toLowerCase() }, { username }],
        },
      });

      if (existingUser) {
        return ctx.badRequest("Email or username already taken");
      }

      // Get default role (authenticated)
      const defaultRole = await strapi.query("plugin::users-permissions.role").findOne({
        where: { type: "authenticated" },
      });

      if (!defaultRole) {
        return ctx.badRequest("Default role not found");
      }

      // Hash the password
      const hashedPassword = await strapi.plugins["users-permissions"].services.user.hashPassword(password);

      // Create user with all fields (convert snake_case to camelCase for database)
      const user = await strapi.query("plugin::users-permissions.user").create({
        data: {
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: first_name,
          lastName: last_name,
          phone,
          address,
          dateOfBirth: date_of_birth,
          gender,
          hearAboutUs: hear_about_us,
          role: defaultRole.id,
          confirmed: true,
          blocked: false,
          provider: "local",
        },
      });

      // Generate JWT token
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log("✅ User created successfully with all fields");

      return ctx.send({
        jwt,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("❌ Registration error:", error);
      return ctx.badRequest(`Registration failed: ${error.message}`);
    }
  };

  console.log("✅ Custom users-permissions extension loaded successfully");
  return plugin;
};
