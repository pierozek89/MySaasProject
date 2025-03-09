import React, { useState } from 'react';
import API from '../api';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid 
} from '@mui/material';

function TaskForm({ onTaskCreated }) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('1');
  const [status, setStatus] = useState('NOWE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', {
        name,
        client_id: parseInt(clientId, 10),
        status,
      });
      setName('');
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Create Task
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="NOWE">NOWE</MenuItem>
              <MenuItem value="W_TRAKCIE">W_TRAKCIE</MenuItem>
              <MenuItem value="ZAKONCZONE">ZAKONCZONE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 1 }}
          >
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskForm;
