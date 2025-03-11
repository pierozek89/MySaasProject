import React, { useEffect, useState } from 'react';
import API from '../api';
import TaskForm from '../components/TaskForm';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress, 
  Button, 
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TaskList from '../components/TaskList';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openTaskForm, setOpenTaskForm] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    fetchTasks();
    setOpenTaskForm(false);
  };

  // Filter tasks by status
  const newTasks = tasks.filter(task => task.status === 'NOWE');
  const inProgressTasks = tasks.filter(task => task.status === 'W_TRAKCIE');
  const completedTasks = tasks.filter(task => task.status === 'ZAKONCZONE');

  return (
    <Container maxWidth={false} disableGutters sx={{ px: 3 }}> {/* Full width container */}
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Production Floor Task Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpenTaskForm(true)}
        >
          Create Task
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Używam Box zamiast Grid dla prostszego układu */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              width: { xs: '100%', md: '33.3%' },
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TaskList 
              tasks={newTasks} 
              onTaskUpdated={fetchTasks} 
              title="New Tasks"
              emptyMessage="No new tasks"
              status="NOWE"
              sx={{ flexGrow: 1, overflow: 'auto' }}
            />
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              width: { xs: '100%', md: '33.3%' },
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TaskList 
              tasks={inProgressTasks} 
              onTaskUpdated={fetchTasks} 
              title="In Progress"
              emptyMessage="No tasks in progress"
              status="W_TRAKCIE"
              sx={{ flexGrow: 1, overflow: 'auto' }}
            />
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              width: { xs: '100%', md: '33.3%' },
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TaskList 
              tasks={completedTasks} 
              onTaskUpdated={fetchTasks} 
              title="Completed Tasks"
              emptyMessage="No completed tasks"
              status="ZAKONCZONE"
              sx={{ flexGrow: 1, overflow: 'auto' }}
            />
          </Paper>
        </Box>
      )}

      {/* Task Creation Dialog */}
      <Dialog 
        open={openTaskForm} 
        onClose={() => setOpenTaskForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create New Task
          <IconButton
            aria-label="close"
            onClick={() => setOpenTaskForm(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TaskForm onTaskCreated={handleTaskCreated} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Home;
