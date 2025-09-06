import React, { useMemo } from "react";
import { Box, Typography } from "@strapi/design-system";
import { Clock } from "@strapi/icons";

// Function to calculate duration in minutes from start and end time
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) {
    return null;
  }

  try {
    // Parse time strings in HH:MM format (24-hour)
    const parseTime = (timeStr) => {
      // Handle formats like "14:30", "09:00", etc.
      if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
        return timeStr.trim();
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

const DurationDisplay = ({ startTime, endTime }) => {
  const duration = useMemo(() => {
    return calculateDuration(startTime, endTime);
  }, [startTime, endTime]);

  if (!duration) {
    return (
      <Box padding={2} background="neutral100" hasRadius>
        <Box display="flex" alignItems="center" gap={2}>
          <Clock />
          <Typography variant="omega" textColor="neutral600">
            Duration will be calculated automatically
          </Typography>
        </Box>
      </Box>
    );
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  let durationText = "";
  if (hours > 0) {
    durationText = `${hours}h ${minutes}m`;
  } else {
    durationText = `${minutes} minutes`;
  }

  return (
    <Box padding={2} background="success100" hasRadius>
      <Box display="flex" alignItems="center" gap={2}>
        <Clock />
        <Typography variant="omega" fontWeight="semiBold" textColor="success700">
          Duration: {durationText}
        </Typography>
      </Box>
    </Box>
  );
};

export default DurationDisplay;
