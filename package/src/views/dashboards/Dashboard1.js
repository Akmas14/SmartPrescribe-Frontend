import React from "react";
import { Grid, Box } from "@mui/material";

import {
  BlogCard,
  SalesOverview,
  ProductPerformance,
  DailyActivities,
} from "./dashboard1-components";
import RenFunction from "./dashboard1-components/RenalFunction";
import GenerateButton from "./dashboard1-components/generateButton";
import Symptom from "./dashboard1-components/Symptom";
const Dashboard1 = () => {
  // 2

  return (
    <Box>
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid item xs={12} lg={12}>
         <SalesOverview />
        </Grid> */}
        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={12} lg={4}>
          <DailyActivities />
          <RenFunction/>
          <Symptom/>
          <GenerateButton/>
         
        </Grid>
        <Grid item xs={12} lg={8}>
          <ProductPerformance />
        </Grid>
        {/* ------------------------- row 3 ------------------------- */}
        {/* <BlogCard /> */}
      </Grid>
    </Box>
  );
};

export default Dashboard1;
