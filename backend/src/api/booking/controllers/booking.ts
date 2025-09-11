/**
 * booking controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::booking.booking", ({ strapi }) => ({
  // Use Strapi's default create method
  async create(ctx) {
    return super.create(ctx);
  },

  // Custom update method
  async update(ctx) {
    console.log("🎯 Booking update called with:", ctx.request.body);
    return super.update(ctx);
  },
}));
