module.exports = {
  plugins: {
    "content-manager": {
      config: {
        contentTypes: {
          "api::class-occurrence.class-occurrence": {
            layouts: {
              edit: [
                {
                  name: "title",
                  size: 6,
                },
                {
                  name: "slug",
                  size: 6,
                },
                {
                  name: "description",
                  size: 12,
                },
                {
                  name: "date",
                  size: 4,
                },
                {
                  name: "startTime",
                  size: 4,
                },
                {
                  name: "endTime",
                  size: 4,
                },
                {
                  name: "maxCapacity",
                  size: 6,
                },
                {
                  name: "price",
                  size: 6,
                },
                {
                  name: "level",
                  size: 6,
                },
                {
                  name: "instructor",
                  size: 6,
                },
                {
                  name: "location",
                  size: 12,
                },
                {
                  name: "isActive",
                  size: 12,
                },
                {
                  name: "thumbnail",
                  size: 6,
                },
                {
                  name: "songThumbnail",
                  size: 6,
                },
                {
                  name: "externalVideoIds",
                  size: 12,
                },
                {
                  name: "bookings",
                  size: 12,
                },
              ],
            },
          },
        },
      },
    },
  },
};
