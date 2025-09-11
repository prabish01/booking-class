/**
 * booking router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::booking.booking", {
  config: {
    create: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    update: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    find: {
      policies: [],
      middlewares: [],
    },
    findOne: {
      policies: [],
      middlewares: [],
    },
  },
});

// Define the custom route separately
export const customRoutes = [
  {
    method: "POST",
    path: "/bookings/create",
    handler: "api::booking.booking.create",
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
];
