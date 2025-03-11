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
  Alert
} from '@mui/material';

function WorkstationForm({ onWorkstationCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await API.post('/workstations', {
        name,
        description,
        client_id: clientId,
      });
      
      // Reset form
      setName('');
      setDescription('');
      if (onWorkstationCreated) {
        onWorkstationCreated();
      }
    } catch (err) {
      console.error('Error creating workstation:', err);
      setError(err.response?.data?.message || 'Failed to create workstation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Create Workstation
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Client</InputLabel>
            <Select
              value={clientId}
              label="Client"
              onChange={(e) => setClientId(e.target.value)}
              disabled={loading || clients.length === 0}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Workstation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 1 }}
            disabled={loading || !name || !clientId}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Workstation'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WorkstationForm;