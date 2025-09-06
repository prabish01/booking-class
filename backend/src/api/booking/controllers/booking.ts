/**
 * booking controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::booking.booking", ({ strapi }) => ({
  // Custom create method for booking validation
  async create(ctx) {
    const { data } = ctx.request.body;

    // Validate that the class occurrence exists and is within 2 weeks
    if (data.classOccurrence) {
      const classOccurrence = await strapi.entityService.findOne("api::class-occurrence.class-occurrence", data.classOccurrence);

      if (!classOccurrence) {
        return ctx.badRequest("Class occurrence not found");
      }

      const classDate = new Date(classOccurrence.date);
      const now = new Date();
      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      if (classDate > twoWeeksFromNow) {
        return ctx.badRequest("Cannot book classes more than 2 weeks in advance");
      }

      if (classDate < now) {
        return ctx.badRequest("Cannot book past classes");
      }
    }

    // Default behavior
    return super.create(ctx);
  },
}));
