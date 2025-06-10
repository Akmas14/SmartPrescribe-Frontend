import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { AppBar, TextField,Toolbar, Typography, Button, Modal, Box, RadioGroup, FormControlLabel, Radio, Container, Grid, Paper } from '@mui/material';
import './LoginForm.css'; // Link to the CSS file for styling
import './LoginForm.css'
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [OTP,setOTP] = useState('')
  const [isOTP,setIsOTP] = useState(false)
  const [match,setMatch] = useState(false)
  const [isNewPassword,setIsNewPassword] = useState(false)
  const handleInput = (e) =>{
    setOTP(
        e.target.value
    )
  }
  const handleInput2 = (e) =>{
    setNewPassword(
        e.target.value
    )
  }
  const generateOTP = async (e) =>{
    e.preventDefault();
    
    
    if (!email) {
      alert('email is required');
      return;
    }
    
    
    try
    {const response = await fetch('http://localhost:3001/auth/Generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email , firstTime: false}),
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
    // {const response = await fetch(http://localhost:3001/auth/Verify/${formData.email}, {
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
    //     alert(Signup failed: ${errorResult.message});
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
    if(match){
      setIsOTP(false)
      setIsNewPassword(true)
    }
       
  }
  const handleNewPassword = async (e) =>{
    try
    {   
        const response = await fetch(`http://localhost:3001/auth/Update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email , password: newPassword}),
      });

      if (response.ok) {
        const result = await response.json();
        setPassword(newPassword)
        handleLoginSubmit()
        // Navigate to the patient dashboard on successful signup
      } else {
        const errorResult = await response.json();
        console.error('Error:', errorResult.message);
        alert(`Password change failed: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during password change. Please try again later.');
    }
       
  }
  const handleLoginSubmit = async (e) => {
    if (!email || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      console.log('Sending login request with data:', { email, password });

const response = await fetch('http://localhost:3001/auth/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ Email: email, password }),
});

const data = await response.json();
console.log("www"+data)
      if (response.ok) {
        //const data = await response.json(); // Parse the JSON response
        console.log(data)
        Cookies.set('accessToken', data.accessToken, { expires: 7 });

        const { accessToken } = data;
        //Cookies.set('token', accessToken, { expires: 0.01 });

        // Store the access token in localStorage (or cookies, depending on your preference)
        localStorage.setItem('accessToken', accessToken);

        // Decode the access token to get the user info
        const decodedToken = jwtDecode(accessToken);

        // Extract the role from the decoded token
        const role = decodedToken.UserInfo.Role;

        // Navigate to the appropriate dashboard based on the user's role
        if (role === 'Patient') {
          navigate('dashboards/dashboard1'); // Navigate to patient dashboard
         } else if (role === 'Physician') {
           navigate('/form-elements/autocomplete'); // Navigate to physician dashboard
         } else {
           setErrorMessage('Invalid user role.');
        }
      } else if (response.status === 401) {
        setErrorMessage('Invalid email or password.');
        alert('Invalid email or password.')
        return
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to connect to the server. Please try again later.');
    }
  };

  const handleGuestClick = () => {
    navigate('/patient-dashboard'); // Redirect to the patient dashboard for guest access
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div>{!isOTP && !isNewPassword &&(<form className="login-form" onSubmit={handleLoginSubmit}>
      <h2 className="login-title">Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field small-input"
        />
      </div>
      <div className="input-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field small-input"
        />
      </div>
      <button type="submit" className="submit-button">Login</button>
      <Button onClick={generateOTP} sx={{ mt: 2 }} fullWidth>
                Forgot Password?
              </Button>
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
  {isNewPassword&&(<div className="modal-overlay">
      <div className="modal-content">
      <Typography
      sx={{
          fontWeight: "500",
          fontSize: "h1.fontSize",
          marginBottom: "0",
        }}
      > 
      </Typography>
      <TextField
      id="default-value"
      label="New Password"
      variant="outlined"
      onChange={handleInput2}
      /*defaultValue="George deo"*/
      fullWidth
      sx={{
        mb: 2,
      }}/>
      <Button label = 'Submit' onClick={handleNewPassword}>Submit </Button>
      </div>
      </div>)}
  </div>
  );
};

export default LoginForm;