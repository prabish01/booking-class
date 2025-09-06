console.log("🧪 TEST EXTENSION LOADED - This should appear in Strapi startup logs!");

module.exports = (plugin) => {
  console.log("🧪 SIMPLE TEST: users-permissions extension is being loaded");
  
  // Just add a simple console log without changing anything
  const originalRegister = plugin.controllers.auth.register;
  
  plugin.controllers.auth.register = async (ctx) => {
    console.log("🧪 TEST: Custom register function is being called!");
    
    // For now, just call the original function
    return await originalRegister(ctx);
  };
  
  console.log("🧪 TEST: Extension setup complete");
  return plugin;
};
