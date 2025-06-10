//import React from "react";
import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Button,
  TextField
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import CreatePatientProfile from './CreatePatientProfile'; // For creating new patient profile
import '../dashboards/dashboard1-components/Meds.css'; // Import the styles
import { useNavigate } from 'react-router-dom'; // Import navigate

import { ComboBoxAutocomplete } from "../../components/Forms/AutoComplete/ComboBoxAutocomplete";

import { MultipleValuesAutocomplete } from "../../components/Forms/AutoComplete/MultipleValuesAutocomplete";
import { CheckboxesAutocomplete } from "../../components/Forms/AutoComplete/CheckboxesAutocomplete";
import { SizesAutocomplete } from "../../components/Forms/AutoComplete/SizesAutocomplete";

const ExAutoComplete = () => {
  // 2
  const navigate = useNavigate(); // Use navigate for routing
  const [patients, setPatients] = useState([]); // List of patients
  const [patientsPatient, setPatientsPatient] = useState([]); // List of patients
  const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded
  const [isAdding, setIsAdding] = useState(false); // Track if we're adding a patient
  const [isCreatingProfile, setIsCreatingProfile] = useState(false); // Track if we're creating a profile
  const [email, setEmail] = useState(''); // Track entered email for adding patient
  const [flag,setFlag] = useState(false)
  // Fetch all patients for this physician on component mount
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

    fetchPatients();
  }, [flag]);

  // Handle adding patient by email
  const handleAddPatient = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3001/physician/add', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: email }), // Send the entered email to the backend
      });
      const result = await response.json();
      if (response.ok) {
        setPatients([...patients, result]); // Add new patient to the list
        setEmail(''); // Clear the email field
        setIsAdding(false); // Hide the search bar
        setFlag(!flag)
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
  };

  // Handle removing a patient
  const handleRemovePatient = async (patientId) => {
    try {
      const token = Cookies.get('accessToken');
      console.log("test3")
      const response = await fetch(`http://localhost:3001/physician/removePatient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log("test1")
      if (response.ok) {
        setPatients(patients.filter((patient) => patient._id !== patientId)); // Remove patient from the list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error removing patient:', error);
      alert('Failed to remove patient.');
    }
  };

  // Handle creating new patient profile
  const handlePatientProfileCreation = async (newPatientData) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3001/physician/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatientData),
      });
      const result = await response.json();
      if (response.ok) {
        setPatients([...patients, result]); // Add new patient to list
        setIsCreatingProfile(false); // Hide create profile modal after creation
        setFlag(!flag)
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating patient profile:', error);
      alert('Failed to create patient profile.');
    }
  };

  // Handle row click to expand and show options
  const handleRowClick = (patientId) => {
    if (expandedRow === patientId) {
      setExpandedRow(null); // Collapse if the same row is clicked again
    } else {
      setExpandedRow(patientId); // Expand the row for this patient
    }
  };

  const handleGenerateRecommendation = (patientId) => {
    navigate(`/physician/patient/${patientId}/manage`);
  };

  const handleViewRecommendations = (patientId) => {
    navigate(`/physician/patient/${patientId}/recommendations`);
  };
  return (
    <Box>
      <div className="patients-list-container">
        <Typography
        sx={{
                fontWeight: "500",
                fontSize: "h1.fontSize",
                marginBottom: "0",
              }}
              gutterBottom>
              Your Patients</Typography>
        <div className="buttons-container">
          <Button variant="contained"
          size="large"
          sx={{
            ml: 1,
          }} onClick={() => setIsAdding(!isAdding)} >Add Patient</Button>
          <Button variant="contained"
          size="large"
          sx={{
            ml: 1,
          }} onClick={() => setIsCreatingProfile(true)} >Create Patient Profile</Button>
        </div>

        {/* Add Patient by Email */}
        {isAdding && (
          <div className="add-patient-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter patient's ID found on the top right of their screen"
              className="input-field"
            />
            <Button onClick={handleAddPatient} className="action-button">Add Patient</Button>
          </div>
        )}

        {/* Patient List Table */}
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <React.Fragment key={patient._id}>
                <tr onClick={() => handleRowClick(patient._id)}>
                  <td>{patient.FullName}</td>
                  <td>{patient.Email}</td>
                  <td>{new Date(patient.DateOfBirth).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="remove-patient-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent expanding row when removing
                        handleRemovePatient(patient._id);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
                {/* {expandedRow === patient._id && (
                  <tr className="expanded-row">
                    <td colSpan="4">
                      <div className="expanded-content">
                        <button
                          className="action-button"
                          onClick={() => handleGenerateRecommendation(patient._id)}
                        >
                          Generate Recommendation
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleViewRecommendations(patient._id)}
                        >
                          View Recommendations
                        </button>
                      </div>
                    </td>
                  </tr>
                )} */}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Patient Profile Modal */}
      {isCreatingProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsCreatingProfile(false)}>&times;</span>
            <CreatePatientProfile onCreate={handlePatientProfileCreation} />
          </div>
        </div>
      )}
     
    </Box>
  );
};

export default ExAutoComplete;
