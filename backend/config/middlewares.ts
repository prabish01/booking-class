export default ({ env }) => [
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:3000", env("FRONTEND_URL")],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept", "stripe-signature"],
      keepHeaderOnError: true,
    },
  },
  {
    name: "strapi::body",
    config: {
      enabled: true,
      json: true,
      raw: true,
      formLimit: "256mb",
      jsonLimit: "256mb",
      textLimit: "256mb",
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 200mb
      },
      patchKoa: true,
      includeUnparsed: true,
    },
  },
  "strapi::errors",
  "strapi::security",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  "strapi::logger",
];
