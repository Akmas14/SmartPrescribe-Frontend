import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie'; // For handling token
import {
    Card,
    CardContent,
    Typography,
    Box,
    Menu,
    MenuItem,
    IconButton,
    Button,
    TextField
  } from "@mui/material";
ChartJS.register(ArcElement, Tooltip, Legend);

const DisapprovalStats = ({ drug }) => {
  const [chartData, setChartData] = useState(null);

  // Fetch data from backend
  

  useEffect(() => {
    const fetchData = async () => {
    try {
      const token = Cookies.get('accessToken'); // Get the token from cookies

      const response = await fetch(`http://localhost:3001/physician/disapprovals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
      });
      console.log(response.data+'test')
      const data =await response.json();

      // Prepare data for the chart
      setChartData({
        
        datasets: [
          {
            data: [data.ExpertOpinion, data.ObservationalStudy,data.RCT,data.SystemicReview,data.Guidelines,data.Other],
            backgroundColor: ['#4CAF50', '#FF5252','#FFC107','#42A5F5','#AB47BC','#FF9800'], // Green for approvals, red for disapprovals
            //hoverBackgroundColor: ['#66BB6A', '#FF6E6E'],
          },
        ],
        labels: ['Expert Opinion', 'Observational Study', 'Randomized Clinical trial (RCT)','Systematic review and meta analysis'
            ,'Guidelines', 'Other'
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };fetchData();
  }, []);

  return (
    <div style={{ width: '400px', margin: 'auto' }}>
      {/* <Card
      variant="outlined"
      sx={{
        pb: 0,
      }}
    >
      <CardContent
        sx={{
          pb: "0 !important",
        }}
      > */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 5,
          }}
        >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "h3.fontSize",
                marginBottom: "0",
              }}
              gutterBottom
            >
            Disapprovals By Category 
              </Typography>
     </Box><Box>
      {chartData ? (
        <Doughnut data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </Box>
    {/* </CardContent>
    </Card> */}
    
    </div>
  );
};

export default DisapprovalStats;
