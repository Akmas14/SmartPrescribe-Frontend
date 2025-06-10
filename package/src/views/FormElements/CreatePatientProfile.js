import React, { useState } from 'react';

const CreatePatientProfile = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
  });
  const [gender,setGender] = useState('')

  const handleRoleChange = (e) => {
    setGender(e.target.value); // Change role based on radio button selection
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bodyData = {
        FullName: formData.fullName,
        Email: formData.email,
        Gender: gender,
        PhoneNumber: formData.phoneNumber,
        DateOfBirth: formData.dob
      };
    onCreate(bodyData); // Send the form data to create the patient profile
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
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
      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default CreatePatientProfile;
