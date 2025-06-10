import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import AutoCompleteSearch from "../../AutoCompleteSearch";
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

import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';


const GenerateButton = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [medications, setMedications] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State for showing/hiding the sidebar
  const [allConditions, setAllConditions] = useState([]); // All available conditions
  const [selectedConditions, setSelectedConditions] = useState([]); // Patient's selected conditions
  const [currentRenalFunction, setCurrentRenalFunction] = useState(''); // Current renal function
  const [newRenalFunction, setNewRenalFunction] = useState(''); // Input for new renal function
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal
  const [recommendation, setRecommendation] = useState(''); // Store the patient report
  const [givenID, setGivenID] = useState(''); // Store user's givenID

  // Fetch medications, conditions, renal function, and givenID on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get the token from cookies

        // Fetch Medications
        const medResponse = await fetch('http://localhost:3001/patient/getDrugs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        const meds = await medResponse.json();
        if (medResponse.ok) {
          setMedications(meds);
        }

        // Fetch Conditions
        const allConditionsResponse = await fetch('http://localhost:3001/patient/conditions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const allConditionsResult = await allConditionsResponse.json();

        const selectedConditionsResponse = await fetch('http://localhost:3001/patient/getConds', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const selectedConditionsResult = await selectedConditionsResponse.json();

        if (allConditionsResponse.ok && selectedConditionsResponse.ok) {
          setAllConditions(allConditionsResult); // Set all available conditions
          setSelectedConditions(selectedConditionsResult.map((cond) => cond._id)); // Set patient's selected conditions (IDs)
        }

        // Fetch Renal Function
        const renalResponse = await fetch('http://localhost:3001/patient/getRenal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const renalResult = await renalResponse.json();
        if (renalResponse.ok) {
          setCurrentRenalFunction(renalResult.message || renalResult); // If renal function is unknown, it returns a message
        }

        // Fetch Given ID
        const givenIdResponse = await fetch('http://localhost:3001/patient/givenID', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const givenIdResult = await givenIdResponse.json();
        if (givenIdResponse.ok) {
          setGivenID(givenIdResult); // Set user's givenID
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  const handleAddMedication = async (medicationName) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3001/patient/addDrug', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drug: medicationName }),
      });

      const result = await response.json();
      if (response.ok) {
        setMedications([...medications, result]);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  };

  const handleRemoveMedication = async (medicationId) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3001/patient/removeDrug', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drug: medicationId }),
      });

      const result = await response.json();
      if (response.ok) {
        setMedications(medications.filter((med) => med._id !== medicationId));
      }
    } catch (error) {
      console.error('Error removing medication:', error);
      alert('Failed to remove medication. Please try again.');
    }
  };

  const handleToggleCondition = async (conditionId) => {
    const isSelected = selectedConditions.includes(conditionId);
    const token = Cookies.get('accessToken');

    try {
      if (isSelected) {
        await fetch('http://localhost:3001/patient/removeCond', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cond: conditionId }),
        });
        setSelectedConditions(selectedConditions.filter((c) => c !== conditionId));
      } else {
        await fetch('http://localhost:3001/patient/addCond', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ condition: conditionId }),
        });
        setSelectedConditions([...selectedConditions, conditionId]);
      }
    } catch (error) {
      console.error('Error toggling condition:', error);
    }
  };

  const handleUpdateRenalFunction = async () => {
    try {
        const token = Cookies.get('accessToken');
        const response = await fetch('http://localhost:3001/patient/updateRenal', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ren: newRenalFunction }),
        });

        const result = await response.json();
        if (response.ok) {
            setCurrentRenalFunction(newRenalFunction);
            setNewRenalFunction('');
            alert('Renal function updated successfully.');
        } else {
            alert(result.message);
        }
    } catch (error) {
      console.error('Error updating renal function:', error);
      alert('Failed to update renal function.');
    }
  };

  const handleGenerateRecommendation = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3001/patient/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setRecommendation(result.patientReport); // Display patient report
        setShowModal(true); // Show modal
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      alert('Failed to generate recommendation.');
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal popup
  };
  return(
  
    
    <Box>
    <Button
    variant="contained"
          size="large"
          sx={{
            ml: 1,
          }}
          OnClick={handleGenerateRecommendation}
          onClick={handleGenerateRecommendation}
        >
          Generate Recommendation
    </Button>
    {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>Recommendation</h2>
            {recommendation.map((rec) => (
            <p>{rec}</p>))} {/* Display the patient report */}
          </div>
        </div>
      )}
    </Box>

  );
};

export default GenerateButton;