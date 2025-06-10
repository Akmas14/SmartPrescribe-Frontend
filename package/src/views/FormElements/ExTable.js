import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import '../dashboards/dashboard1-components/Meds.css'
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
const ExTable = (id3) => {  
  //const { id } = useParams(); // Get the patient ID from the route
  const [medications, setMedications] = useState([]);
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
  const [id,setId] = useState(id3.id2)
  const [patients, setPatients] = useState([]); // List of patients

  // Fetch medications, conditions, and renal function on component mount
  useEffect(() => {
    const fetchData = async () => {
      if(id){try {
        const token = Cookies.get('accessToken'); // Get the token from cookies
        console.log("table" + id)
        // Fetch Medications
        const medResponse = await fetch(`http://localhost:3001/physician/getDrugs/${id}`, {
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
        //setMedications(meds);

        // Fetch Conditions
        const allConditionsResponse = await fetch('http://localhost:3001/physician/conditions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const allConditionsResult = await allConditionsResponse.json();
        console.log(allConditionsResult)
        setAllConditions(allConditionsResult)
        const selectedConditionsResponse = await fetch(`http://localhost:3001/physician/getConds/${id}`, {
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
        const renalResponse = await fetch(`http://localhost:3001/physician/getRenal/${id}`, {
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
        //setCurrentRenalFunction(renalResult.message || renalResult); // If renal function is unknown, it returns a message

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      }}
    };
    // const fetchPatients = async () => {
    //     try {
    //       const token = Cookies.get('accessToken');
    //       const response = await fetch('http://localhost:3001/physician/getPatients', {
    //         method: 'GET',
    //         headers: {
    //           'Authorization': `Bearer ${token}`,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       const result = await response.json();
    //       if (response.ok) {
    //         setPatients(result); // Set the fetched patients
    //       } else {
    //         alert(result.message);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching patients:', error);
    //       alert('Failed to load patients.');
    //     }
    //   };
  
    // fetchPatients();
    fetchData();
  }, [id]);

  // Handle adding medication
  const handleAddMedication = async (medicationId) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/addDrug/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drug: medicationId }),
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

  // Handle removing medication
  const handleRemoveMedication = async (medicationId) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/removeDrug/${id}`, {
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

  // Handle toggling condition
  const handleToggleCondition = async (conditionId) => {
    const isSelected = selectedConditions.includes(conditionId);
    const token = Cookies.get('accessToken');

    try {
      if (isSelected) {
        await fetch(`http://localhost:3001/physician/removeCond/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cond: conditionId }),
        });
        setSelectedConditions(selectedConditions.filter((c) => c !== conditionId));
      } else {
        await fetch(`http://localhost:3001/physician/addCond/${id}`, {
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

  // Handle updating renal function
  const handleUpdateRenalFunction = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/updateRenal/${id}`, {
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

  // Handle generating recommendation
  const handleGenerateRecommendation = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/generate/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setActiveDrugs(result.ActiveDrug);
        setRecommendationId(result._id);
        setRecommendation(result.physicianReport); // Display patient report
        setShowModal(true); // Show modal
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      alert('Failed to generate recommendation.');
    }
  };

  // Handle opening feedback modal
  const openFeedbackModal = () => {
    setFeedbackMedications(activeDrugs || []); // Load ActiveDrugs into feedback modal
    setFeedbackModal(true);
  };

  // Handle giving feedback (approve/disapprove)
  const handleGiveFeedback = async (medication, approval, comment = '') => {
    try {
      const token = Cookies.get('accessToken');
      await fetch(`http://localhost:3001/physician/Feedback/${recommendationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ med: medication, approval, comment }),
      });
      // Remove the medication from the feedback list
      setFeedbackMedications((prevMeds) => {
        const updatedMeds = prevMeds.filter((med) => med !== medication);
        if (updatedMeds.length === 0) {
          setFeedbackModal(false); // Close modal if no medications left
        }
        return updatedMeds;
      });
    } catch (error) {
      console.error('Error giving feedback:', error);
      alert('Failed to give feedback.');
    }
  };

  // Handle approving all medications
  const handleApproveAll = async () => {
    const remainingMedications = [...feedbackMedications]; // Copy all remaining medications
    try {
      const token = Cookies.get('accessToken');
      // Loop through all medications and approve them
      for (const medication of remainingMedications) {
        await fetch(`http://localhost:3001/physician/Feedback/${recommendationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ med: medication, approval: true, comment: '' }),
        });
      }
      // Clear the feedback list after all approvals and close the modal
      setFeedbackMedications([]);
      setFeedbackModal(false); // Close modal when done
    } catch (error) {
      console.error('Error approving all medications:', error);
      alert('Failed to approve all medications.');
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal popup
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
    
        
    <div className="table conditions-and-renal-container">
    <div className="conditions-table">
      <ul>
        {allConditions.map((condition) => (
          <li
            key={condition._id}
            className={` ${selectedConditions.includes(condition._id) ? 'selected' : 'table-item'}`}
            onClick={() => handleToggleCondition(condition._id)}
          >
            {condition.Name}
          </li>
        ))}
      </ul>
    </div></div>
  )
}
export default ExTable;
