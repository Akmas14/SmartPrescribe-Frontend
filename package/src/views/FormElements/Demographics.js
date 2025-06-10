import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
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
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Demographics = () => {
  const [chartData, setChartData] = useState(null);

  // Fetch demographics data from the backend
  const fetchData = async () => {
    try {
      const token = Cookies.get('accessToken'); // Get the token from cookies 
      const response = await fetch('http://localhost:3001/physician/demographics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Assuming JWT token is stored in localStorage
        }
      });

      const data = await response.json();

      // Process the data for chart display
      const ageGroups = data.map(item => item.age);
      const maleCounts = data.map(item => item.males);
      const femaleCounts = data.map(item => item.females);

      setChartData({
        labels: ageGroups,
        datasets: [
          {
            label: 'Males',
            data: maleCounts,
            backgroundColor: '#42A5F5' // Blue
          },
          {
            label: 'Females',
            data: femaleCounts,
            backgroundColor: '#FF4081' // Pink
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching demographics data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: '600px', margin: 'auto' }}>
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
            Your Patients' Demographics
              </Typography>
     </Box><Box>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Patient Demographics by Age & Gender' }
            },
            scales: {
              x: { title: { display: true, text: 'Age' } },
              y: { title: { display: true, text: 'Number of Patients' }, beginAtZero: true }
            }
          }}
        />
      ) : (
        <p>Loading chart data...</p>
      )}</Box>
      
    </div>
  );
};

export default Demographics;
