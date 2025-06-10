import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
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
  } from "@mui/material";
import './LoginForm.css'; // Use the same CSS as the login form for consistent styling

const PhysicianSignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    field: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [isOTP,setIsOTP] = useState(false)
  const [OTP,setOTP] = useState('')
  const [match,setMatch] = useState(false)
  const navigate = useNavigate(); // Initialize the hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleInput = (e) =>{
    setOTP(
        e.target.value
    )
  }
  const generateOTP = async (e) =>{
    e.preventDefault();
    if (formData.age < 65) {
      alert('Age must be at least 65.');
      return;
    }
    if (!formData.fullName || !formData.field || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      alert('All fields are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    console.log(formData.email)
    const email1 = formData.email
    console.log(email1)
    try
    {const response = await fetch('http://localhost:3001/auth/Generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email1 , firstTime: true}),
      });
    const result = await response.json();
      if (response.ok) {
       
        setIsOTP(true)

        // Navigate to the patient dashboard on successful signup
      } else {
        alert('email already exists please use a different one')
        return
      }
    } catch (error) {
      console.error('Error during signup:', error);
      
    }
    // try
    // {const response = await fetch(`http://localhost:3001/auth/Verify/${formData.email}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(OTP),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
        
    //     setMatch(result)
    //     // Navigate to the patient dashboard on successful signup
    //   } else {
    //     const errorResult = await response.json();
    //     console.error('Error:', errorResult.message);
    //     alert(`Signup failed: ${errorResult.message}`);
    //   }
    // } catch (error) {
    //   console.error('Error during signup:', error);
    //   alert('An error occurred during signup. Please try again later.');
    // }
    // if(match)
    //     handleSubmit()
  }
  const verifyOTP = async(e) =>{
    try
    {   
        const email = formData.email
        const response = await fetch(`http://localhost:3001/auth/Verify/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp:OTP}),
      });

      if (response.ok) {
        const result = await response.json();
        
        setMatch(result)
        // Navigate to the patient dashboard on successful signup
      } else {
        const errorResult = await response.json();
        console.error('Error:', errorResult.message);
        alert(`Signup failed: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    }
    if(match)
        handleSubmit()
  }
  const handleSubmit = async (e) => {
      

    // Prepare the data to send
    const bodyData = {
      FullName: formData.fullName,
      Email: formData.email,
      Password: formData.password,
      Role: 'Physician',
      PhoneNumber: formData.phoneNumber,
      Specialty: formData.field,
    };

    try {
      // Send data to the backend
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        Cookies.set('accessToken', result.accessToken, { expires: 7 });

        // Navigate to the physician dashboard on successful signup
        navigate('/form-elements/autocomplete');
      } else {
        const errorResult = await response.json();
        console.error('Error:', errorResult.message);
        alert(`Signup failed: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div>{!isOTP&&(<form className="signup-form" onSubmit={handleSubmit}>
      <h2 className="signup-title">Physician Sign Up</h2>
      <div className="input-group">
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Field of Specialization:</label>
        <input
          type="text"
          name="field"
          value={formData.field}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>
      <button type="submit" className="submit-button">Sign Up</button>
    </form>)}
    {isOTP&&(  <div className="modal-overlay">
        <div className="modal-content">
        <Typography
        sx={{
            fontWeight: "500",
            fontSize: "h1.fontSize",
            marginBottom: "0",
          }}
        >
            Please Check your Inbox for the OTP we've sent you (it may be in your spam file)
        </Typography>
        <TextField
        id="default-value"
        label="OTP"
        variant="outlined"
        onChange={handleInput}
        /*defaultValue="George deo"*/
        fullWidth
        sx={{
          mb: 2,
        }}/>
        <Button label = 'Submit' onClick={()=>verifyOTP}>Submit </Button>
        <Button label = 'Resend' onClick={generateOTP}>Resend Code </Button>
        </div>
        </div> 
    )}
    </div>
  );
};

export default PhysicianSignUpForm;
