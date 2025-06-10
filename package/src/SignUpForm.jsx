import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import BasicDatePicker from './BasicDatePicker';
import moment from 'moment';
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

const PatientSignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: null,
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender:''
  });
  const navigate = useNavigate();
  const [gender,setGender] = useState('')
  const [isOTP,setIsOTP] = useState(false)
  const [OTP,setOTP] = useState('')
  const [match,setMatch] = useState(false)
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
  const handleDateChange = (date) => {
    const age = moment().diff(moment(date), 'years');
    setFormData({
      ...formData,
      dob: date,
      age: age,
    });
    // if (age < 65) {
    //   alert('Age cannot be less than 65');
    // }
  };
  const generateOTP = async (e) =>{
    e.preventDefault();
    if (formData.age < 65) {
      alert('Age must be at least 65.');
      return;
    }
    if (!formData.fullName || !formData.dob || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
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
      Role: 'Patient',
      PhoneNumber: formData.phoneNumber,
      DateOfBirth: formData.dob,
      Gender: gender
    };
    console.log('test')

    try {
      // Send data to the backend
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      console.log('test')
      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        Cookies.set('accessToken', result.accessToken, { expires: 7 });

        // Navigate to the patient dashboard on successful signup
        navigate('dashboards/dashboard1');
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
  const handleRoleChange = (e) => {
    setGender(e.target.value); // Change role based on radio button selection
  };
  return (
    <div>
        {!isOTP&&(
            <form className="signup-form" onSubmit={generateOTP}>
      <h2 className="signup-title">Patient Sign Up</h2>
      <div className="input-group">
        <label>Patient's Full Name:</label>
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
        <label>Date of Birth:</label>
        {/* <DatePicker
          selected={formData.dob}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableYearDropdown
          className="input-field"
        /> */}
        <DatePicker
      selected={formData.dob}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      className="input-field"
    />
        {/* <DatePicker
  label="Controlled picker"
  value={formData.dob}
  onChange={handleDateChange}
  views={['year', 'month', 'day']}

/> */}
      </div>
      <div className="input-group">
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          readOnly
          className="input-field"
        />
      </div>
      <div>
                  <label>
                    <input
                      type="radio"
                      value="female"
                      checked={gender === 'female'}
                      onChange={handleRoleChange}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="male"
                      checked={gender === 'male'}
                      onChange={handleRoleChange}
                    />
                    Male
                  </label>
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
        <Button label = 'Submit' onClick={verifyOTP}>Submit </Button>
        <Button label = 'Resend' onClick={generateOTP}>Resend Code </Button>
        </div>
        </div> 
    )}
    </div>
  );
};

export default PatientSignUpForm;
