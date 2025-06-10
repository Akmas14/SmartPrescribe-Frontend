import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import '../../dashboards/dashboard1-components/Meds.css'; // Import the styles
import '../../../AutoCompleteSearchPhysician'
import '../../../AutoCompleteSymptomPhysician'
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
} from "@mui/material";
import AutoCompleteSearch from '../../../AutoCompleteSearchPhysician';
import AutoCompleteSymptom from '../../../AutoCompleteSymptomPhysician';

const numbers = [
  {
    value: "1",
    label: "Mild",
  },
  {
    value: "2",
    label: "Severe",
  },
  {
    value: "0",
    label: "None",
  },
  
];

const FbDefaultForm = () => {
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
  });
  const [recommendations, setRecommendations] = useState([]); // Store recommendations
  const [expandedRow, setExpandedRow] = useState(null); // To track which row is expanded
  const [selectedRecommendation, setSelectedRecommendation] = useState(null); // Store the details of the clicked recommendation
  const [id,setId] = useState('')
  const [patients, setPatients] = useState([]); // List of patients
  const [updates,setUpdates] = useState([])
  const [update,setUpdate] = useState({
    renalFunction:-1,
    conditions: [],
    current_medications: [],
    symptoms:[]
  })
  const [updateMed,setUpdateMed] = useState([])
  const [updateCond,setUpdateCond] = useState([])
  const [updateSymptom,setUpdateSymptom] = useState([])

  const [selectedUpdate,setSelectedUpdate] = useState(null)
  const [selectedRow,setSelectedRow] = useState(null)
  const [view,setView] = useState(true)
  const [medications, setMedications] = useState([])
  const [allConditions,setAllConditions] = useState([])
  const [selectedConditions,setSelectedConditions] = useState([])
  const [currentRenalFunction,setCurrentRenalFunction] = useState([])
  const [symptoms,setSymptoms] = useState([])
  const [flag,setFlag] = useState(false)
  const [readyMeds,setReadyMeds] = useState([])
  const [readyConds,setReadyConds] = useState([])
  const [readySymptoms,setReadySymptoms] = useState([])
  const [addMed,setAddMed] = useState(false)
  const [addCond,setAddCond] = useState(false)
  const [addSymptom,setAddSymptom] = useState(false)
  const [remainingConds, setRemainingConds] = useState([])

  // Fetch all recommendations for the patient on component mount
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
          setSelectedConditions(selectedConditionsResult); // Set patient's selected conditions (IDs)
          setRemainingConds(allConditions.filter((c) => !selectedConditions.includes(c)))
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
        const sympResponse = await fetch(`http://localhost:3001/physician/getSymptoms/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        const symps = await sympResponse.json();
        if (sympResponse.ok) {
          setSymptoms(symps);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
      }
    };
    fetchPatients();
    if(id!=='')
    fetchData()
  }, [id,flag]);
  useEffect(()=>{
    setMedications([...medications])
    setReadyMeds([...readyMeds])
    setSelectedConditions([...selectedConditions])
    setReadyConds([...readyConds])
    setSymptoms([...symptoms])
    setReadySymptoms([...readySymptoms])
    
  },[flag])
  const handleRowClick2 = (id) => {
    setId(id)
  };
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = React.useState("");

  const handleChange2 = (event) => {
    setValue(event.target.value);
  };

  const [number, setNumber] = React.useState("");

  const handleChange3 = (event) => {
    setNumber(event.target.value);
  };
  const getUpdates = async () => {
    setView(false)
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/getUpdate/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUpdates(result); // Set the fetched patients
        console.log(result)
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Failed to load updates.');
    }
  }
  const fetchUpdateByID = async(id2) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/getUpdate/${id}/${id2}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log('test')
      if (response.ok) {
        setSelectedUpdate(result); // Set the fetched patients
        console.log(result)
        setSelectedRow(id2)
        console.log(selectedUpdate._id+" tes")
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Failed to load update.');
    }
  }
  const handleRowClick3 =  (id2) =>{
    console.log(id2)
    if(selectedRow===id2){
      setSelectedRow(null)
    }
    else{
      fetchUpdateByID(id2)
    }
  }
  const handleMedication = (med, loweredDosage = false ) =>{
    const drug = {
      medication_name: med.Medication,
      loweredDosage: loweredDosage
    }
    setUpdateMed([...updateMed,drug])
    setMedications(medications.filter((m)=>m!==med))
    setReadyMeds([...readyMeds,med])
  }
  const handleCondition = (cond, severity = 1)=>{
    const condition = {
      condition_name: cond.Name,
      severity:severity
    }
    setUpdateCond([...updateCond,condition])
    setSelectedConditions(selectedConditions.filter((cond2)=> cond2!==cond))
    setReadyConds([...readyConds,cond])
    console.log(updateCond)
  }
  const handleSymptom = (symp, severity = 1)=>{
    const symptom = {
      name: symp.Name,
      severity: severity
    }
    setUpdateSymptom([...updateSymptom,symptom])
    setSymptoms(symptoms.filter((s)=>s!==symp))
    setReadySymptoms([...readySymptoms, symp])
  }
  const handleRemoveSymptom = async(name) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/removeSymptom/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symptom: name }),
      });

      const result = await response.json();
      if (response.ok) {
        setSymptoms(symptoms.filter((med) => med.Name !== name));
        setFlag(!flag)
        console.log(medications)
      }
    } catch (error) {
      console.error('Error removing symptom:', error);
      alert('Failed to remove symptom. Please try again.');
    }
   
  }
  const handleRemoveCond = async (id2) => {
    const token = Cookies.get('accessToken');

    try {
        const response = await fetch(`http://localhost:3001/physician/removeCond/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cond: id2 }),
        });
        const result = await response.json()
        if(response.ok){
        setSelectedConditions(selectedConditions.filter((c) => c._id !== id2));
        setRemainingConds(allConditions.filter((c) => !selectedConditions.includes(c)))
        setFlag(!flag)  
      }
      }
      catch (error) {
        console.error('Error removing condition:', error);
        alert('Failed to remove condition. Please try again.');
      }
      
  }
  const handleRemoveMed = async (id2) => {
    try {
      const token = Cookies.get('accessToken');
      console.log('test 1')
      const response = await fetch(`http://localhost:3001/physician/removeDrug/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drug: id2 }),
      });

      const result = await response.json();
      console.log('test 2')
      if (response.ok) {
        setMedications(medications.filter((med) => med._id !== id2));
        console.log('test 1 '+ medications)
        setFlag(!flag)
      }
    } catch (error) {
      console.error('Error removing medication:', error);
      alert('Failed to remove medication. Please try again.');
    }
  }
  const handleAddMed = async (medicationId) => {
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
        alert(`successfully added ${medicationId} to the update form`)
        setMedications([...medications,result])
        setFlag(!flag)
        setAddMed(false)
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  }
  const handleAddCond = async (conditionId) => {
    try{
    const token = Cookies.get('accessToken');
    console.log('test 11')
    const response = await fetch(`http://localhost:3001/physician/addCond/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condition: conditionId }),
    });
    const result = await response.json()
    console.log('test 11'+ result.Name)
    if(response.ok){
      setAddCond([...selectedConditions,result])
      setFlag(!flag)
      console.log('test 11 '+ result)
      setRemainingConds(allConditions.filter((c) => selectedConditions.includes(c)===false))
      setAddCond(false)
    }
  }
  catch (error) {
    console.error('Error adding condition:', error);
    alert('Failed to add condition. Please try again.');
  }
}
  const handleAddSymptom = async (name) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/addSymp/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symptom: name }),
      });

      const result = await response.json();
      if (response.ok) {
        setSymptoms([...symptoms,result])
        setAddSymptom(false)
        setFlag(!flag)
      }
    } catch (error) {
      console.error('Error adding symptom:', error);
      alert('Failed to add symptom. Please try again.');
    }
  }
  const handleRen = (e) => {
    setCurrentRenalFunction(e.target.value)
  }

  const onSubmit = async () =>{
    const body = {
      renalFunction: currentRenalFunction,
      conditions: updateCond,
      medications: updateMed,
      symptoms: updateSymptom

    }
    try {
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3001/physician/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      console.log("test 111")
      const result = await response.json();
      console.log(body)
      if (response.ok) {
        alert('Successfully submited update')
        console.log(result)
        console.log(updateCond)
        console.log(updateMed)
        console.log(updateSymptom)
        console.log(body)
      }
    } catch (error) {
      console.error('Error adding symptom:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  }
  return (
    <div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* Basic Checkbox */}
      {/* ------------------------------------------------------------------------------------------------ */}
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
      
      {id&& view&&(<Card
        variant="outlined"
        sx={{
          p: 0,
        }}
      >
        <Box
          sx={{
            padding: "15px 30px",
          }}
          display="flex"
          alignItems="center"
        >
          <Box flexGrow={1}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Update Us On Your Patient
            </Typography>
          </Box>
        </Box>
        <Divider />
        <CardContent
          sx={{
            padding: "30px",
          }}
        >
          <form>
          <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Medications
            </Typography>
          <div className="medications-table">
          <ul>
            {medications.map((med) => (
              <li key={med._id} className="table-item">
                {med.Medication}
                <div>
                <Button  
                variant="contained"
                sx={{
                   ml: 1,
                }} 
                onClick={()=>handleMedication(med,true)}>Lowered Dosage</Button>
                <Button
                variant="contained"
                sx={{
                   ml: 1,
                }} 
                onClick={()=>handleMedication(med,false)}>Same Dosage</Button>
                <button className="remove-med-btn" onClick={()=> handleRemoveMed(med._id)}>
                  Deprescribed
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="medications-table">
          <ul>
            {readyMeds.map((med) => (
              <li key={med._id} className="table-item">
                {med.Medication}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={()=>setAddMed(!addMed)}>Add Medication</Button>  
        {addMed &&( <AutoCompleteSearch onAdd={handleAddMed}/>)}
        <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Conditions
            </Typography>
          <div className="medications-table">
          <ul>
            {selectedConditions.map((cond) => (
              <li key={cond._id} className="table-item">
                {cond.Name}
                <div>
                <Button  
                variant="contained"
                sx={{
                   ml: 1,
                }} 
                onClick={()=>handleCondition(cond,0)}>Improving</Button>
                <Button
                variant="contained"
                sx={{
                   ml: 1,
                }} 
                onClick={()=>handleCondition(cond,1)}>Same State</Button>
                <Button
                variant="contained"
                sx={{
                   ml: 1,
                }} 
                onClick={()=>handleCondition(cond,2)}>Worsening</Button>
                <button className="remove-med-btn" onClick={() => handleRemoveCond(cond._id)}>
                  No Longer Present
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="medications-table">
          <ul>
            {readyConds.map((cond) => (
              <li key={cond._id} className="table-item">
                {cond.Name}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={()=>setAddCond(!addCond)}>Add Condition</Button>  
        {addCond &&( <TextField
              fullWidth
              id="standard-select-number"
              variant="outlined"
              select
              label="New Condition"
              value={allConditions}
              //onChange={handleAddCond}
              sx={{
                mb: 2,
              }}
            >
              {allConditions.map((option) => (
                <MenuItem key={option._id} value={option._id} onClick={()=> handleAddCond(option._id)}>
                  {option.Name}
                </MenuItem>
              ))}
            </TextField>)}  
        <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Symptoms
            </Typography>
          <div className="medications-table">
          <ul>
            {symptoms.map((symp) => (
              <li key={symp._id} className="table-item">
                {symp.Name}
                <div>
                <Button  
                variant="contained"
                 
                onClick={()=>handleSymptom(symp,0)}>Improving</Button>
                <Button
                variant="outlined"
                
                onClick={()=>handleSymptom(symp,1)}>Same State</Button>
                <Button
                variant="contained"
                
                onClick={()=>handleSymptom(symp,2)}>Worsening</Button>
                <button className="remove-med-btn" onClick={() => handleRemoveSymptom(symp.Name)}>
                  No Longer Present
                </button></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="medications-table">
          <ul>
            {readySymptoms.map((symp) => (
              <li key={symp._id} className="table-item">
                {symp.Name}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={()=>setAddSymptom(!addSymptom)}>Add Symptom</Button>  
        {addSymptom &&( <AutoCompleteSymptom onAdd={handleAddSymptom}/>)}    
            <TextField
              id="default-value"
              label="Renal Function"
              variant="outlined"
              defaultValue= {currentRenalFunction}
              //value={currentRenalFunction}
              onChange={(e)=>handleRen(e)}
              fullWidth
              sx={{
                mb: 2,
              }}
            />
            {/* <TextField
              id="email-text"
              label="Side Effects"
              type="email"
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            /> */}
            {/* <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            /> */}
            {/* <TextField
              id="outlined-multiline-static"
              label="Social History"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            />
            <TextField
              id="outlined-multiline-static"
              label="Family History"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            />
            <TextField
              id="outlined-multiline-static"
              label="Past Medical History"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            /> */}
            {/* <TextField
              id="readonly-text"
              label="Read Only"
              defaultValue="Hello World"
              inputprops={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
              }}
            /> */}
            <Grid
              container
              spacing={0}
              sx={{
                mb: 2,
              }}
            >
              {/* <Grid item lg={4} md={6} sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedA}
                      onChange={handleChange}
                      name="checkedA"
                      color="primary"
                    />
                  }
                  label="Check this custom checkbox"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedB}
                      onChange={handleChange}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Check this custom checkbox"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedC}
                      onChange={handleChange}
                      name="checkedC"
                      color="primary"
                    />
                  }
                  label="Check this custom checkbox"
                />
              </Grid> */}
              {/* <Grid item lg={4} md={6} sm={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={value}
                    onChange={handleChange2}
                  >
                    <FormControlLabel
                      value="radio1"
                      control={<Radio />}
                      label="Toggle this custom radio"
                    />
                    <FormControlLabel
                      value="radio2"
                      control={<Radio />}
                      label="Toggle this custom radio"
                    />
                    <FormControlLabel
                      value="radio3"
                      control={<Radio />}
                      label="Toggle this custom radio"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid> */}
            </Grid>
            {/* <TextField
              fullWidth
              id="standard-select-number"
              variant="outlined"
              select
              label="Symptom Severity"
              value={number}
              onChange={handleChange3}
              sx={{
                mb: 2,
              }}
            >
              {numbers.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
            <div>
              <Button color="primary" variant="contained" onClick={onSubmit}>
                Submit
              </Button>
              <Button color="primary" variant="outlined" onClick={getUpdates}>
                View Updates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>)}
      {!view &&(<div className="recommendations-container">
      <h1>Patient's Previous Updates</h1>
      <table className="recommendations-table">
        <thead>
          <tr>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {updates.map((rec) => (
            <React.Fragment key={rec._id}>
              <tr onClick={() => handleRowClick3(rec._id)}>
                <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
              </tr>
              {selectedRow === rec._id && selectedUpdate && (
               <tr className="recommendation-details">
               <td>
                 <div>
                   <strong>Conditions:</strong> 
                   {selectedUpdate.conditions.map((condition, index) => (
                     <span key={index}>
                       {condition.condition_name} 
                       {condition.severity !== undefined && ` (Severity: ${condition.severity})`}
                       {index < selectedUpdate.conditions.length - 1 && ", "}
                     </span>
                   ))}
                 </div>
                 <div>
                   <strong>Active Drugs:</strong> 
                   {selectedUpdate.current_medications.map((medication, index) => (
                     <span key={index}>
                       {medication.medication_name} 
                       {medication.loweredDosage !== undefined && 
                         ` (Lowered Dosage: ${medication.loweredDosage ? "Yes" : "No"})`}
                       {index < selectedUpdate.current_medications.length - 1 && ", "}
                     </span>
                   ))}
                 </div>
                 <div>
                   <strong>Symptoms:</strong> 
                   {selectedUpdate.symptoms.map((symptom, index) => (
                     <span key={index}>
                       {symptom.name} 
                       {symptom.severity !== undefined && ` (Severity: ${symptom.severity})`}
                       {index < selectedUpdate.symptoms.length - 1 && ", "}
                     </span>
                   ))}
                 </div>
                 <div>
                   <strong>Renal Function:</strong> {selectedUpdate.renal_function}
                 </div>
               </td>
             </tr>
             
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>)}
    </div>
  );
};

export default FbDefaultForm;
