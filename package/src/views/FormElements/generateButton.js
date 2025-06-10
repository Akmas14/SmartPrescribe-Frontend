import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import AutoCompleteSearch from "../AutoCompleteSearch";
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
    TextField,
    Grid
  } from "@mui/material";
  const Reasons = [
    {
      value: "Expert opinion",
      label: "Expert opinion",
    },
    {
      value: "Observational Study",
      label: "Observational Study",
    },
    {
      value: "Randomized Clinical trial (RCT)",
      label: "Randomized Clinical trial (RCT)",
    },
    {
        value: "Systematic review and meta analysis",
        label: "Systematic review and meta analysis",
    },
    {
        value: "Guidelines",
        label: "Guidelines",
    },
    
  ];
const GenerateButton = (id2) => {
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
  const [id,setId] = useState(id2.id2)
  const [patients, setPatients] = useState([]); // List of patients
  const [reason,setReason] = useState('');
  const [other,setOther] = useState({});
  const [showAIModal,setShowAIModal] = useState(false)
  const [showAIModalRec,setShowAIModalRec] = useState(false)
  const [aiRec,setAiRec] = useState('')
  // Fetch medications, conditions, and renal function on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get the token from cookies

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

        // Fetch Conditions
        const allConditionsResponse = await fetch('http://localhost:3001/physician/conditions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const allConditionsResult = await allConditionsResponse.json();

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
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      }
    };
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
  
      fetchPatients();
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
  const handleGiveFeedback = async (medication, approval, comment = '',reason,other = '') => {
    if(approval === false){
        if (reason==='') {
            alert('Please Select A Reason For Disapproval');
            return;
          }
          if (reason==='Other'&& other==='') {
            alert('Please Type Your Reason For Disapproval');
            return;
          }  
    }
    try {
      const token = Cookies.get('accessToken');
      await fetch(`http://localhost:3001/physician/Feedback/${recommendationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ med: medication, approval, comment,reason,other }),
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
   const handleGenerateRecommendationUsingAI = async () => {
//     try {
//         const token = Cookies.get('accessToken');
//         const response = await fetch(`http://localhost:3001/physician/generateUsingAI/${id}`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
  
//         const result = await response.json();
//         if (response.ok) {
//           setAiRec(result)
//           setShowAIModal(false)
//           setShowAIModalRec(true)
//         } else {
//           alert(result.message);
//         }
//       } catch (error) {
//         console.error('Error generating recommendation:', error);
//         alert('Failed to generate recommendation.');
//       }
  }

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
  const handleChange3 = (e) =>{
    setReason(e.target.value)
  }
 
  return(
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
    {id&&(
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
    <Button
    variant="outlined"
          size="large"
          sx={{
            ml: 1,
          }}
          onClick={()=>setShowAIModal(true)}
        >
          Generate Recommendation Using AI
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
            {/* Feedback Link */}  
            <a className="link" onClick={openFeedbackModal}>
                Give Feedback</a>
            {/* Learn More button */}
            <div className="learn-more-container">
              <button
                className="learn-more-button"
                onClick={() => window.open('https://pubmed.ncbi.nlm.nih.gov/37139824/', '_blank')}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    {showAIModal&&(  <div className="modal-overlay">
        <div className="modal-content">
        <span className="close-button" onClick={()=>setShowAIModal(false)}>
              &times;
            </span>
        <Typography
        sx={{
            fontWeight: "500",
            fontSize: "h1.fontSize",
            marginBottom: "0",
          }}
        >
            Warning!
        </Typography>
        <Typography
        sx={{
            fontWeight: "500",
            fontSize: "h3.fontSize",
            marginBottom: "0",
          }}
        >
            Please take into consideration that the following recommendation is generated using AI and may contain mistakes.
            Please double check the facts so that the patient is not harmed. Would you like to proceed?
        </Typography>
        <Button label = 'Submit' onClick={handleGenerateRecommendationUsingAI}>Proceed </Button>
        </div>
        </div> 
    )}
    {showAIModalRec&&(  <div className="modal-overlay">
        <div className="modal-content">
        <span className="close-button" onClick={()=>setShowAIModalRec(false)}>
              &times;
            </span>
        <h2>Recommendation</h2>
        <p>{aiRec}</p>
        </div>
        </div> 
    )}
      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setFeedbackModal(false)}>
              &times;
            </span>
            <h2>Give Feedback</h2>
            <ul className="medications-table feedback-list">
              {feedbackMedications.map((medication, index) => (
                <React.Fragment key={index}>
                  <li className="table-item" onClick={() => handleRowClick(medication)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {medication}
                      <div className="feedback-buttons" style={{alignItems:'end', display:'flex',alignSelf:'end',justifyContent:'flex-end'}}>
                        <button
                          className="approve-button"
                          onClick={() => handleGiveFeedback(medication, true)}
                          style={{marginRight:'auto'}}
                        >
                          Approve
                        </button>
                        <button
                          className="disapprove-button"
                          onClick={() => handleRowClick(medication)}
                          style={{marginRight:'auto'}}

                        >
                          Disapprove
                        </button>
                      </div>
                    </div>
                  </li>
                  {expandedMedication === medication && (
                    <tr className="expanded-row">
                      <td colSpan="2">
                      {/* <Grid item xs={12} lg={4}>

                        {/* <div className="comment-box">
                          <input
                            type="text"
                            placeholder="Enter comment"
                            value={comments[medication] || ''}
                            onChange={(e) => setComments({ ...comments, [medication]: e.target.value })}
                          />
                          
                        </div></Grid> */} 

                        <TextField
              fullWidth
              id="standard-select-number"
              variant="outlined"
              select
              label="Reason For Disapproval"
              value={reason}
              onChange={handleChange3}
              sx={{
                mb: 2,
              }}
            >
              {Reasons.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {reason==='Other'&&(<tr className="expanded-row">
                      <td colSpan="2">
                        <div className="comment-box">
                          <input
                            type="text"
                            placeholder="Enter Reason"
                            value={other[medication] || ''}
                            onChange={(e) => setOther({ ...other, [medication]: e.target.value })}
                          /></div>
                          </td>
                        </tr>)}
                          <button
                            className="submit-comment"
                            onClick={() => handleGiveFeedback(medication, false,'',reason,other[medication])}
                          >
                            Submit Feedback
                          </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </ul>

            {/* Approve All Button */}
            <button
              className="approve-all-btn"
              onClick={handleApproveAll}
            >
              Approve All
            </button>

            {/* Cancel Button */}
            <button className="cancel-btn" onClick={() => setFeedbackModal(false)}>
              Cancel
            </button>
          </div>
            
        </div>
    )}</Box>)}
    </Box>
  )
}
export default GenerateButton