import React, { useState, useEffect } from 'react';
import API from '../api';
import WorkstationForm from '../components/WorkstationForm';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Workstations() {
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkstations = async () => {
    setLoading(true);
    try {
      const res = await API.get('/workstations');
      setWorkstations(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching workstations:', err);
      setError('Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkstations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workstation?')) {
      return;
    }
    
    try {
      await API.delete(`/workstations/${id}`);
      fetchWorkstations();
    } catch (err) {
      console.error('Error deleting workstation:', err);
      setError('Error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workstation Management
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <WorkstationForm onWorkstationCreated={fetchWorkstations} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workstations
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : workstations.length === 0 ? (
              <Typography color="textSecondary">No workstations available</Typography>
            ) : (
              <List>
                {workstations.map((workstation, index) => (
                  <React.Fragment key={workstation.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDelete(workstation.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={workstation.name}
                        secondary={workstation.description || 'No description'}
                      />
                      {workstation.Client && (
                        <Chip 
                          label={workstation.Client.name} 
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 2 }}
                        />
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Workstations;