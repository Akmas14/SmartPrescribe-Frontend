import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // For handling token
import '../dashboards/dashboard1-components/Meds.css'; // Import CSS for styling

const BasicTable = () => {
  const [recommendations, setRecommendations] = useState([]); // Store recommendations
  const [expandedRow, setExpandedRow] = useState(null); // To track which row is expanded
  const [selectedRecommendation, setSelectedRecommendation] = useState(null); // Store the details of the clicked recommendation

  // Fetch all recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get token from cookies

        const response = await fetch('http://localhost:3001/patient/getRec', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in request headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setRecommendations(result); // Set recommendations
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        alert('Failed to load recommendations. Please try again.');
      }
    };

    fetchRecommendations();
  }, []);

  // Fetch a specific recommendation by ID
  const fetchRecommendationById = async (recId) => {
    try {
      const token = Cookies.get('accessToken');

      const response = await fetch(`http://localhost:3001/patient/getRec/${recId}`, {
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

  return (
    <div className="recommendations-container">
      <h1>Your Previous Recommendations</h1>
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
                      <strong>Patient Report:</strong> {selectedRecommendation.patientReport}
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
    </div>
  );
};

export default BasicTable;
