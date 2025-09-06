/**
 * Lifecycle hooks for class-occurrence content type
 */

// Utility function to generate slug from title
function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Remove special characters except hyphens
      .replace(/[^a-z0-9-]/g, "")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

// Function to ensure unique slug
async function ensureUniqueSlug(strapi, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
    };

    // Exclude current record when updating
    if (excludeId) {
      query.filters.documentId = {
        $ne: excludeId,
      };
    }

    const existing = await strapi.entityService.findMany("api::class-occurrence.class-occurrence", query);

    if (!existing || existing.length === 0) {
      return slug;
    }

    // If slug exists, append counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.title && !data.slug) {
      const baseSlug = generateSlug(data.title);
      data.slug = await ensureUniqueSlug(strapi, baseSlug);
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (data.title) {
      const baseSlug = generateSlug(data.title);
      data.slug = await ensureUniqueSlug(strapi, baseSlug, where.documentId);
    }
  },
};
