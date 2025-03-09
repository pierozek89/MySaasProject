import React, { useState } from 'react';
import API from '../api';

// Simple form to create a new task
// Adjust fields to match your data model (category, assigned_to, etc.)
function TaskForm({ onTaskCreated }) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('1'); // Hard-coded for demo
  const [status, setStatus] = useState('NOWE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to create a new task
      await API.post('/tasks', {
        name,
        client_id: parseInt(clientId, 10),
        status,
      });
      setName('');
      onTaskCreated(); // Tell parent component to refresh task list
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <h3>Create Task</h3>
      <div>
        <label>Task Name: </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Client ID: </label>
        <input
          type="number"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      </div>
      <div>
        <label>Status: </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="NOWE">NOWE</option>
          <option value="W_TRAKCIE">W_TRAKCIE</option>
          <option value="ZAKONCZONE">ZAKONCZONE</option>
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
