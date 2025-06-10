import React,{useEffect,useState} from "react";
import { Grid, Box } from "@mui/material";
import Cookies from 'js-cookie'; // For handling token
import {
    Card,
    CardContent,
    Typography,
  } from "@mui/material";
import ApprovalRates from "./ApprovalRates";
import DisapprovalStats from "./DisapprovalStats";
import Demographics from "./Demographics";
const Dashboard1 = () => {
  // 2
  const [noPatients,setNoPatients] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get the token from cookies

        const Response = await fetch(`http://localhost:3001/physician/patients/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const patients = await Response.json();
        if (Response.ok) {
          setNoPatients(patients);
        }
    }
    catch (error) {
        console.error('Error occured ', error);
        alert('Server Error Occured');
      }
}
    fetchData();
  }, []);



  return (
    <Box>
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
          
        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={14} lg={4}>
        <Typography
        sx={{
            fontWeight: "500",
            fontSize: "h1.fontSize",
            marginBottom: "0",
          }}
          gutterBottom
        >
            Number Of Patients: {noPatients}
        </Typography>
        <Demographics />
        </Grid>
        </Grid>
        <Grid container spacing={0}>
           <Typography
        sx={{
            fontWeight: "500",
            fontSize: "h1.fontSize",
            marginBottom: "0",
          }}
          gutterBottom
        >
           Approval of Recommendations Statisctics 
        </Typography> 
        </Grid>
        <Grid container spacing={0}>
            
        <Grid item xs={12} lg={4}>
        
          <ApprovalRates drug=''/>
        </Grid>
        <Grid item xs={12} lg={8}>
        <DisapprovalStats drug=''/>

        </Grid>
        
        <Grid item xs={12} lg={6}>
         {/* <Demographics /> */}
        </Grid>
        <Grid item xs={12} lg={4}>
        

        </Grid>
        {/* ------------------------- row 3 ------------------------- */}
        {/* <BlogCard /> */}
        
      </Grid>
    </Box>
  );
};

export default Dashboard1;
