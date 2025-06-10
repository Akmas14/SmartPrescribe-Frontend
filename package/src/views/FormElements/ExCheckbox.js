import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For accessing route params
import Cookies from 'js-cookie'; // For handling token
import '../dashboards/dashboard1-components/Meds.css'; // Import the styles
import {
  Grid,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

import BaseCard from "../../components/BaseCard/BaseCard";

import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

const ExCheckbox = () => {
  // 2
  const { id2 } = useParams(); // Get patient ID from URL
  const [recommendations, setRecommendations] = useState([]); // Store recommendations
  const [expandedRow, setExpandedRow] = useState(null); // To track which row is expanded
  const [selectedRecommendation, setSelectedRecommendation] = useState(null); // Store the details of the clicked recommendation
  const [id,setId] = useState('')
  const [patients, setPatients] = useState([]); // List of patients

  // Fetch all recommendations for the patient on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      if(id!== null){try {
        const token = Cookies.get('accessToken'); // Get token from cookies
        
        const response = await fetch(`http://localhost:3001/physician/getRec/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in request headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setRecommendations(result); // Set recommendations for the patient
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        alert('Failed to load recommendations. Please try again.');
      }
    };}
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
    if(id)
    fetchRecommendations();
  }, [id]); // Run when patient ID changes

  // Fetch a specific recommendation by ID
  const handleSelect = async (id) =>{
    setId(id)
  }
  const fetchRecommendationById = async (recId) => {
    try {
      const token = Cookies.get('accessToken');

      const response = await fetch(`http://localhost:3001/physician/getRec/${id}/${recId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedRecommendation(result); // Set the detailed recommendation data
        setExpandedRow(recId); // Expand the row for this recommendation
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      alert('Failed to load recommendation details. Please try again.');
    }
  };

  // Handle row click
  const handleRowClick = (recId) => {
    if (expandedRow === recId) {
      setExpandedRow(null); // Collapse if the same row is clicked again
    } else {
      fetchRecommendationById(recId); // Fetch the details if a different row is clicked
    }
  };
  const handleRowClick2 = (id) => {
    setId(id)
  };
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
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
      
      {id&&(<div className="recommendations-container">
      <h1>Patient's Recommendations</h1>
      <table className="recommendations-table">
        <thead>
          <tr>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((rec) => (
            <React.Fragment key={rec._id}>
              <tr onClick={() => handleRowClick(rec._id)}>
                <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
              </tr>
              {expandedRow === rec._id && selectedRecommendation && (
                <tr className="recommendation-details">
                  <td>
                    <div>
                      <strong>Conditions:</strong> {selectedRecommendation.conditionNames.join(', ')}
                    </div>
                    <div>
                      <strong>Active Drugs:</strong> {selectedRecommendation.ActiveDrug.join(', ')}
                    </div>
                    <div>
                      <strong>Renal Function:</strong> {selectedRecommendation.renalFunction}
                    </div>
                    <div>
                      <strong>Physician Report:</strong> {selectedRecommendation.physicianReport}
                    </div>
                    {/* Add the Learn More button here */}
                    <div className="learn-more-container">
                      <button 
                        className="learn-more-button" 
                        onClick={() => window.open('https://www.drugs.com/drug_interactions.html', '_blank')}
                      >
                        Learn More
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>)}
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
       
      </Grid>
    </Box>
  );
};

export default ExCheckbox;
