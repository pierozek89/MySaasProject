import React, { useEffect, useState } from 'react';
import API from '../api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';

// Main page for viewing and creating tasks
function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Called after a new task is created to refresh the list
  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Production Floor Task Management
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <TaskList tasks={tasks} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
