import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Modal, Box, RadioGroup, FormControlLabel, Radio, Container, Grid, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import PatientSignUpForm from './SignUpForm';
import PhysicianSignUpForm from './PhysicianSignUpForm';

const WelcomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLearnMore = () => {
    window.open('https://pubmed.ncbi.nlm.nih.gov/37139824/', '_blank');
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          mt: 8,
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Welcome to SmartPrescribe
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h3"
          sx={{
            color: 'text.secondary',
            mb: 4,
          }}
        >
          Revolutionizing medical prescriptions with AI-driven insights.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGetStarted}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </Box>

        {/* Features Section */}
        <Grid
          container
          spacing={4}
          sx={{
            mt: 6,
          }}
        >
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Easy-to-Use Platform
              </Typography>
              <Typography variant="body1">
                Simplify your medical prescriptions with our intuitive, user-friendly interface.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                AI-Powered Recommendations
              </Typography>
              <Typography variant="body1">
                Get intelligent suggestions tailored to patient needs using cutting-edge technology.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal for Log In / Sign Up */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {isSignUp ? (
            <>
              <Typography variant="h6" gutterBottom>
                Sign Up as a:
              </Typography>
              <RadioGroup
                value={selectedRole}
                onChange={handleRoleChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 2 }}
              >
                <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                <FormControlLabel value="physician" control={<Radio />} label="Physician" />
              </RadioGroup>
              {selectedRole === 'patient' ? <PatientSignUpForm /> : <PhysicianSignUpForm />}
              <Button onClick={handleLoginClick} sx={{ mt: 2 }} fullWidth>
                Already have an account? Log In
              </Button>
            </>
          ) : (
            <>
              <LoginForm />
              <Button onClick={handleSignUpClick} sx={{ mt: 2 }} fullWidth>
                Don’t have an account? Sign Up
              </Button>
              
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default WelcomePage;
