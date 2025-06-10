import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import AutoCompleteSymptom from '../../../AutoCompleteSymptom';
import './Meds.css'
import { useParams } from 'react-router-dom'; // For accessing route params
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
const Symptom = (id2) =>{
    //const { id } = useParams(); // Get the patient ID from the route
  const [medications, setMedications] = useState([]);
  const [flag,setFlag] = useState(false)
  const [allConditions, setAllConditions] = useState([]); // All available conditions
  const [selectedConditions, setSelectedConditions] = useState([]); // Patient's selected conditions
  const [currentRenalFunction, setCurrentRenalFunction] = useState(''); // Current renal function
  const [newRenalFunction, setNewRenalFunction] = useState(''); // Input for new renal function
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal
  const [recommendation, setRecommendation] = useState(''); // Store the patient report
  const [recommendationId, setRecommendationId] = useState(''); // Store the patient report
  const [feedbackModal, setFeedbackModal] = useState(false); // Modal for feedback
  const [feedbackMedications, setFeedbackMedications] = useState([]); // Store medications for feedback
  const [comments, setComments] = useState({}); // Store comments for each medication
  const [activeDrugs, setActiveDrugs] = useState([]);
  const [expandedMedication, setExpandedMedication] = useState(null); // Track expanded medication row
  const [id,setId] = useState(id2.id2)
  const [patients, setPatients] = useState([]); // List of patients

  // Fetch medications, conditions, and renal function on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get the token from cookies

        // Fetch Medications
        const medResponse = await fetch(`http://localhost:3001/patient/getSymptoms`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const meds = await medResponse.json();
        if (medResponse.ok) {
          setMedications(meds);
          console.log(medications)
        }

    }
    catch(e){
        alert(e.message)
    }
}
    fetchData();
  }, [flag]);

  // Handle adding medication
  const handleAddMedication = async (name) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/patient/addSymp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symptom: name }),
      });

      const result = await response.json();
      if (response.ok) {
        setMedications([...medications, result]);
        setFlag(!flag)
      }
    } catch (error) {
      console.error('Error adding symptom:', error);
      alert('Failed to add symptom. Please try again.');
    }
  };

  // Handle removing medication
  const handleRemoveMedication = async (name) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/patient/removeSymptom`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symptom: name }),
      });

      const result = await response.json();
      console.log(medications+' testst')
      if (response.ok) {
        setMedications(medications.filter((med) => med.Name !== name));
        setFlag(!flag)
        console.log(medications)
      }
    } catch (error) {
      console.error('Error removing symptom:', error);
      alert('Failed to remove symptom. Please try again.');
    }
  };

  

  // Handle expanding and collapsing rows for medications
  const handleRowClick = (medication) => {
    if (expandedMedication === medication) {
      setExpandedMedication(null); // Collapse if clicked again
    } else {
      setExpandedMedication(medication); // Expand if clicked
    }
  };
  const handleRowClick2 = (id) => {
    setId(id)
  };
  return(
    <Box>
    <Card
      variant="outlined"
      sx={{
        pb: 0,
      }}
    >
      <CardContent
        sx={{
          pb: "0 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "h3.fontSize",
                marginBottom: "0",
              }}
              gutterBottom
            >
            Symptoms
              </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
              sx={{
                fontWeight: "400",
                fontSize: "13px",
              }}
            >
              Please enter the Symptoms
            </Typography>
          <Box
            sx={{
              marginBottom: "0"
            }}
          >
            <AutoCompleteSymptom onAdd={handleAddMedication} />

            {/* <IconButton
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertOutlinedIcon />
            </IconButton> */}
            {/* <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={handleClose}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu> */}
          </Box></Box>
          
          </Box>
        {/* Medications List */}
        <div className="medications-table">
          <ul>
            {medications.map((med) => (
              <li key={med._id} className="table-item">
                {med.Name}
                <button className="remove-med-btn" onClick={() => handleRemoveMedication(med.Name)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>       
        {/* <Timeline
          sx={{
            p: 0,
          }}
        >
          {activities.map((activity) => (
            <TimelineItem key={activity.time}>
              <TimelineOppositeContent
                sx={{
                  fontSize: "12px",
                  fontWeight: "700",
                  flex: "0",
                }}
              >
                {activity.time}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  variant="outlined"
                  sx={{
                    borderColor: activity.color,
                  }}
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                color="text.secondary"
                sx={{
                  fontSize: "14px",
                }}
              >
                {activity.text}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline> */}
      </CardContent>
    </Card>
    </Box>
  )
}
export default Symptom;
