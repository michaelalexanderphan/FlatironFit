import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function WorkoutDetail({ workoutId, onBackClick }) {
  const { token } = useContext(AuthContext);
  const [workoutDetail, setWorkoutDetail] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkoutDetail = async () => {
      try {
        const response = await axios.get(`/api/workouts/${workoutId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkoutDetail(response.data);
      } catch (err) {
        setError('Failed to fetch workout details');
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (err) {
        setError('Failed to fetch clients');
      }
    };

    fetchWorkoutDetail();
    fetchClients();
  }, [workoutId, token]);

  const handleAssignToClient = async () => {
    if (!selectedClientId) {
      alert("Please select a client to assign the workout to.");
      return;
    }
    try {
      await axios.post(`/api/workouts/${workoutId}/assign`, { client_id: selectedClientId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Workout assigned successfully.");
    } catch (err) {
      setError('Failed to assign workout');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workoutDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Workout Details</h2>
      {/* Workout details display */}
      
      {/* Client assignment functionality */}
      <div>
        <h3>Assign to Client:</h3>
        <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
          <option value="">Select a Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        <button onClick={handleAssignToClient}>Assign Workout</button>
      </div>

      <button onClick={onBackClick}>Back to Workouts</button>
    </div>
  );
}

export default WorkoutDetail;
