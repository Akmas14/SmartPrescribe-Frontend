import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie'; // For handling token from cookies
import Tesseract from 'tesseract.js';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Menu,
    Grid,
    MenuItem,
    IconButton,
  } from "@mui/material";
const AutoCompleteSearch = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [medications, setMedications] = useState([]); // Store fetched medications
  const [medNames, setMedNames] = useState([]); // Store medication names for filtering
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [cameraActive, setCameraActive] = useState(false); // Track if the camera is active
  const [listening, setListening] = useState(false); // Track if speech recognition is active
  const videoRef = useRef(null); // For video element
  const canvasRef = useRef(null); // For capturing image
  const recognitionRef = useRef(null); // For speech recognition

  // Fetch medications from backend on component mount
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = Cookies.get('accessToken'); // Retrieve JWT token
    
        const response = await fetch('http://localhost:3001/patient/meds', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token in request headers
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error fetching medications: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        if (Array.isArray(data)) {
          const medNamesArray = data.map((med) => med.Medication); // Extract medication names
          setMedications(data); // Store full medications object
          setMedNames(medNamesArray); // Store medication names for filtering
        } else {
          console.error('Error: Data is not an array.');
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };
    fetchMedications();
  }, []);

  // Filter medication names based on input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Filter medNames array for matching names
    const options = medNames.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(options); // Update filtered options to display
  };

  // Handle selection of a medication
  const handleOptionClick = (selectedName) => {
    onAdd(selectedName); // Pass medication name to parent handler
    setInput(''); // Clear input field after selection
    setFilteredOptions([]); // Clear filtered options
  };

  // Handle adding a custom medication on pressing enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onAdd(input); // Add the custom medication
      setInput(''); // Clear input
      setFilteredOptions([]); // Clear filtered options
    }
  };

  // Handle camera toggle
  const handleCameraToggle = () => {
    setCameraActive(!cameraActive);
    if (!cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  // Start camera stream
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Handle capture of image and use OCR to recognize text
  const handleCapturePhoto = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    console.log("tst1")
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      Tesseract.recognize(blob, 'eng').then(({ data: { text } }) => {
        setInput(text.trim()); // Set recognized text to input
        stopCamera();
        setCameraActive(false);
        const value = input;
        const options = medNames.filter((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(options);
      });
    });
  };

  // Start/stop speech recognition
  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const speechText = event.results[0][0].transcript.toLowerCase();
        const matchedMed = medNames.find((name) => speechText.includes(name.toLowerCase()));

        if (matchedMed) {
          setInput(matchedMed);
          onAdd(matchedMed); // If a medication matches, add it
        } else {
          alert("No medication in our list detected, try again.");
        }

        setListening(false); // Stop listening after receiving speech
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event);
        setListening(false);
      };
    }

    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div>
      <Box>
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Listen for Enter key
          placeholder="Search medications or add your own..."
          style={{
            padding: '10px',
            width: '150%',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        /><Box
        sx={{
            marginLeft: "auto"
          }}
        >
        {cameraActive && (
          <button
            onClick={handleCapturePhoto}
            style={{
              position: 'absolute',
              right: '-80px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'green',
              border: 'none',
              color: 'white',
              borderRadius: '5px',
              padding: '5px',
            }}
          >
            Capture
          </button>
        )}
        <button
          onClick={handleCameraToggle}
          style={{
            position: 'absolute',
            right: '-80px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
          }}
        >
          📷
        </button></Box>
        <Box
            sx={{
                marginLeft: "auto"
              }}
        >
        <button
          onClick={handleMicToggle}
          style={{
            position: 'absolute',
            right: '-110px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
          }}
        >
          🎤
        </button>
        </Box>
      </div></Box>

      {cameraActive && (
        <div>
          <video ref={videoRef} width="100%" style={{ borderRadius: '8px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas for image capture */}
        </div>
      )}

      {filteredOptions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', padding: '10px', listStyle: 'none', margin: '0' }}>
          {filteredOptions.map((name, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(name)} // Select the name
              style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #eee' }}
            >
              {name} {/* Display medication name */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteSearch;
