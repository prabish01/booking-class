export default {
  routes: [
    {
      method: "POST",
      path: "/bookings/create",
      handler: "api::booking.booking.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/bookings/:id/update",
      handler: "api::booking.booking.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
