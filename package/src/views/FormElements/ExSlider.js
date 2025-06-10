import React,{useState, useEffect} from "react";
import { Grid, Box, Slider } from "@mui/material";
import BaseCard from "../../components/BaseCard/BaseCard";
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined';
import GenerateButton from "./generateButton";
import RenFunction from "./RenalFunction";
import ProductPerformance from "./ProductPerformance";
import DailyActivities from "./DailyActivities";
import Cookies from 'js-cookie'; // For handling token
import Symptom from "./Symptom";
const valuetext = (value) => {
  return `${value}°C`;
};

function valuetext2(value) {
  return `${value}°C`;
}

const ExSlider = (idd) => {
  // 2
  const [id,setId] = useState('')
  const [patients, setPatients] = useState([]); // List of patients

  // Fetch medications, conditions, and renal function on component mount
  useEffect(() => {
    const fetchPatients = async () => {
        try {
          const token = Cookies.get('accessToken');
          const response = await fetch('http://localhost:3001/physician/getPatients', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          if (response.ok) {
            setPatients(result); // Set the fetched patients
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
          alert('Failed to load patients.');
        }
      };
      console.log(id  + "tesettstst")
      fetchPatients();
  }, [id]);

  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState([20, 37]);

  const handleChange2 = (event2, newValue2) => {
    setValue2(newValue2);
  };
  const handleRowClick2 = (id) => {
    setId(id)
    console.log(id)
  };
  return (
    <Box>
      {!id&&(
        <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <React.Fragment key={patient._id}>
              <tr onClick={() => handleRowClick2(patient._id)}>
                <td>{patient.FullName}</td>
                <td>{patient.Email}</td>
                <td>{new Date(patient.DateOfBirth).toLocaleDateString()}</td>
                
              </tr>
              
            </React.Fragment>
          ))}
        </tbody>
      </table>
      )}
      {id&&(<Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid item xs={12} lg={12}>
         <SalesOverview />
        </Grid> */}
        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={12} lg={4}>
          <DailyActivities id2={id} />
          <RenFunction id2={id}/>
          <Symptom id2={id}/>
          <GenerateButton id2={id}/>
        </Grid>
        <Grid item xs={12} lg={8}>
          <ProductPerformance id={id} />
        </Grid>
        {/* ------------------------- row 3 ------------------------- */}
        {/* <BlogCard /> */}
      </Grid>)}
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid
          item
          xs={12}
          lg={4}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <BaseCard title="Default Slider">
            <Slider defaultValue={30} aria-label="slider" />
          </BaseCard>
        </Grid> */}

        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid
          item
          xs={12}
          lg={4}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <BaseCard title="Default Disabled Slider">
            <Slider disabled defaultValue={30} aria-label="slider" />
          </BaseCard>
        </Grid> */}

        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid
          item
          xs={12}
          lg={4}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <BaseCard title="Default Volumn Slider">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <VolumeDownOutlinedIcon />
              <Slider
                aria-label="Volume"
                value={value}
                onChange={handleChange}
              />
              <VolumeUpOutlinedIcon />
            </Box>
          </BaseCard>
        </Grid> */}

        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid
          item
          xs={12}
          lg={4}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <BaseCard title="Default Discrete Slider">
            <Slider
              aria-label="Temperature"
              defaultValue={30}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={110}
            />
          </BaseCard>
        </Grid> */}

        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid
          item
          xs={12}
          lg={4}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <BaseCard title="Default Range  Slider">
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={value2}
              onChange={handleChange2}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext2}
            />
          </BaseCard>
        </Grid>*/}
      </Grid> 
    </Box>
  );
};

export default ExSlider;
