import React, { useState, useEffect } from 'react';
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
  Grid,
  CircularProgress,
  FormHelperText,
  Alert
} from '@mui/material';

function TaskForm({ onTaskCreated }) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [workstationId, setWorkstationId] = useState('');
  const [priority, setPriority] = useState('ZWYKŁY');
  const [clients, setClients] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Fetch available clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('/clients');
        setClients(res.data);
        if (res.data.length > 0) {
          setClientId(res.data[0].id); // Set default client
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      }
    };
    
    fetchClients();
  }, []);

  // Fetch workstations when client changes
  useEffect(() => {
    if (!clientId) return;
    
    const fetchWorkstations = async () => {
      try {
        const res = await API.get(`/workstations/client/${clientId}`);
        setWorkstations(res.data);
        // Clear previously selected workstation
        setWorkstationId('');
        setFormErrors({...formErrors, workstation: ''});
      } catch (err) {
        console.error('Error fetching workstations:', err);
      }
    };
    
    fetchWorkstations();
  }, [clientId]);

  const validate = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.length > 150) {
      errors.name = 'Name must be less than 150 characters';
    }
    
    if (!workstationId) {
      errors.workstation = 'Workstation selection is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await API.post('/tasks', {
        name,
        client_id: clientId,
        status: 'NOWE', // Always set to NOWE as default
        workstation_id: workstationId,
        priority
      });
      
      // Reset form
      setName('');
      setPriority('ZWYKŁY');
      setWorkstationId('');
      setFormErrors({});
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Create Task
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            disabled={loading}
            error={!!formErrors.name}
            helperText={formErrors.name || `${name.length}/150 characters`}
            InputProps={{
              inputProps: { maxLength: 150 }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="NISKI">Niski</MenuItem>
              <MenuItem value="ZWYKŁY">Zwykły</MenuItem>
              <MenuItem value="WYSOKI">Wysoki</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl 
            fullWidth 
            margin="normal" 
            required
            error={!!formErrors.workstation}
          >
            <InputLabel>Workstation</InputLabel>
            <Select
              value={workstationId}
              label="Workstation *"
              onChange={(e) => {
                setWorkstationId(e.target.value);
                if (e.target.value) {
                  setFormErrors({...formErrors, workstation: ''});
                }
              }}
              disabled={loading || workstations.length === 0}
            >
              {workstations.map((workstation) => (
                <MenuItem key={workstation.id} value={workstation.id}>
                  {workstation.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.workstation && (
              <FormHelperText>{formErrors.workstation}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 1 }}
            disabled={loading || !name || !workstationId}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Task'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskForm;
