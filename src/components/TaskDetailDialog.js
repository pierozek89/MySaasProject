import React, { useState, useEffect } from 'react';
import API from '../api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function TaskDetailDialog({ open, taskId, onClose, onTaskUpdated }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await API.get(`/tasks/${taskId}`);
      setTask(res.data);
      setComments(res.data.Comments || []);
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (open && taskId) {
      fetchTaskDetails();
    }
  }, [open, taskId]);
  
  const handleCommentAdded = () => {
    fetchTaskDetails();
    if (onTaskUpdated) onTaskUpdated();
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      fetchTaskDetails();
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'NISKI': return '#3f51b5'; // blue
      case 'ZWYKŁY': return '#ff9800'; // orange
      case 'WYSOKI': return '#f44336'; // red
      default: return '#ff9800';
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'NISKI': return 'Niski';
      case 'ZWYKŁY': return 'Zwykły';
      case 'WYSOKI': return 'Wysoki';
      default: return 'Zwykły';
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'NOWE': return 'New';
      case 'W_TRAKCIE': return 'In Progress';
      case 'ZAKONCZONE': return 'Completed';
      default: return status;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'NOWE': return 'info';
      case 'W_TRAKCIE': return 'warning';
      case 'ZAKONCZONE': return 'success';
      default: return 'default';
    }
  };
  
  if (!open) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
    >
      <DialogTitle>
        Task Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : task ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                {task.name}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip 
                  label={getStatusLabel(task.status)} 
                  color={getStatusColor(task.status)}
                  size="small"
                />
                
                <Chip
                  icon={<FlagIcon fontSize="small" />}
                  label={getPriorityLabel(task.priority)}
                  size="small"
                  sx={{
                    backgroundColor: `${getPriorityColor(task.priority)}20`,
                    color: getPriorityColor(task.priority)
                  }}
                />
                
                {task.Workstation && (
                  <Chip 
                    label={task.Workstation.name}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Comments
            </Typography>
            
            <CommentList 
              comments={comments} 
              onDeleteComment={handleDeleteComment} 
            />
            
            <CommentForm 
              taskId={taskId} 
              onCommentAdded={handleCommentAdded} 
            />
          </>
        ) : (
          <Typography>No task selected</Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDetailDialog;