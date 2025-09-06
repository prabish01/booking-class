import React from "react";
import { Box, Grid, GridItem, Typography, Divider } from "@strapi/design-system";
import { useFormikContext } from "formik";
import DurationDisplay from "../components/DurationDisplay";

const ClassOccurrenceEditView = () => {
  const { values } = useFormikContext();

  // Get start and end time values from the form
  const startTime = values?.startTime;
  const endTime = values?.endTime;

  return (
    <Box>
      {/* Duration Display - show this after the time fields */}
      {(startTime || endTime) && (
        <Box marginTop={4} marginBottom={4}>
          <Typography variant="delta" marginBottom={2}>
            Class Duration
          </Typography>
          <DurationDisplay startTime={startTime} endTime={endTime} />
        </Box>
      )}
    </Box>
  );
};

export default ClassOccurrenceEditView;
