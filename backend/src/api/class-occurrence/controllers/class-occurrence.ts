/**
 * class-occurrence controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::class-occurrence.class-occurrence", ({ strapi }) => ({
  // Custom find method to filter by date range
  async find(ctx) {
    const { query } = ctx;

    // If startDate and endDate are provided, filter by date range
    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate as string);
      const endDate = new Date(query.endDate as string);

      // Simply use the provided date range - don't enforce 2-week limit here
      // The 2-week limit should be handled by the frontend when requesting bookable classes

      const data = await strapi.entityService.findMany("api::class-occurrence.class-occurrence", {
        ...query,
        filters: {
          ...(typeof query.filters === "object" && query.filters ? query.filters : {}),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        populate: ["bookings", "thumbnail", "songThumbnail"],
      });

      return { data };
    }

    // Default behavior
    return super.find(ctx);
  },
}));
