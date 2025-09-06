/**
 * Lifecycle hooks for class-occurrence content type
 */

// Function to calculate duration in minutes from start and end time
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) {
    return null;
  }

  try {
    // Parse time strings (assuming format like "14:30" or "2:30 PM" or just "3")
    const parseTime = (timeStr) => {
      // Handle simple hour format like "3" -> "03:00"
      if (/^\d{1,2}$/.test(timeStr.trim())) {
        return `${timeStr.padStart(2, "0")}:00`;
      }

      // Handle formats like "14:30", "2:30", etc.
      if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
        return timeStr.trim();
      }

      // Handle 12-hour format like "2:30 PM"
      if (/^\d{1,2}(:\d{2})?\s*(AM|PM)$/i.test(timeStr.trim())) {
        const [time, period] = timeStr.trim().split(/\s+/);
        const [hours, minutes = "00"] = time.split(":");
        let hour24 = parseInt(hours);

        if (period.toUpperCase() === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (period.toUpperCase() === "AM" && hour24 === 12) {
          hour24 = 0;
        }

        return `${hour24.toString().padStart(2, "0")}:${minutes}`;
      }

      return timeStr.trim();
    };

    const normalizedStartTime = parseTime(startTime);
    const normalizedEndTime = parseTime(endTime);

    // Create date objects for calculation (using arbitrary date)
    const baseDate = "2000-01-01";
    const startDateTime = new Date(`${baseDate} ${normalizedStartTime}`);
    const endDateTime = new Date(`${baseDate} ${normalizedEndTime}`);

    // Handle case where end time is next day (e.g., start: 23:00, end: 01:00)
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    // Calculate difference in milliseconds and convert to minutes
    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    return diffMinutes > 0 ? diffMinutes : null;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return null;
  }
}

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

    // Generate slug from title
    if (data.title && !data.slug) {
      const baseSlug = generateSlug(data.title);
      data.slug = await ensureUniqueSlug(strapi, baseSlug);
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Update slug if title changes
    if (data.title) {
      const baseSlug = generateSlug(data.title);
      data.slug = await ensureUniqueSlug(strapi, baseSlug, where.documentId);
    }
  },
};
