import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Divider,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlagIcon from '@mui/icons-material/Flag';
import API from '../api';
import DraggableTask from './DraggableTask';
import TaskDetailDialog from './TaskDetailDialog';

function TaskList({ tasks, onTaskUpdated, title, emptyMessage, status, sx = {} }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Implementacja drop target
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => handleTaskDrop(item),
    canDrop: (item) => {
      // Can't move tasks from W_TRAKCIE or ZAKONCZONE to NOWE
      if (status === 'NOWE' && (item.status === 'W_TRAKCIE' || item.status === 'ZAKONCZONE')) {
        return false;
      }
      // Can only drop if status is different
      return item.status !== status;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });
  
  // Funkcja obsługująca upuszczenie zadania
  const handleTaskDrop = async (item) => {
    try {
      setLoading(true);
      await API.put(`/tasks/${item.id}`, {
        status: status
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Error moving task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTask) return;
    
    setLoading(true);
    try {
      await API.put(`/tasks/${selectedTask.id}`, {
        ...selectedTask,
        status: newStatus
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!selectedTask) return;
    
    setLoading(true);
    try {
      await API.put(`/tasks/${selectedTask.id}`, {
        ...selectedTask,
        priority: newPriority
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task priority:', err);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    
    setLoading(true);
    try {
      await API.delete(`/tasks/${selectedTask.id}`);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
      handleMenuClose();
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
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'NISKI': return '#3f51b5'; // blue
      case 'ZWYKŁY': return '#ff9800'; // orange
      case 'WYSOKI': return '#f44336'; // red
      default: return '#ff9800'; // default orange
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Status-specific menu options
  const getStatusMenuItems = () => {
    // Don't show the current status as an option
    if (!selectedTask) return [];
    
    const items = [];
    // Only show "Move to New" option if task is not already in W_TRAKCIE or ZAKONCZONE
    if (selectedTask.status !== 'NOWE' && 
        selectedTask.status !== 'W_TRAKCIE' && 
        selectedTask.status !== 'ZAKONCZONE') {
      items.push(
        <MenuItem key="new" disabled={loading} onClick={() => handleStatusChange('NOWE')}>
          Move to New
        </MenuItem>
      );
    }
    if (selectedTask.status !== 'W_TRAKCIE') {
      items.push(
        <MenuItem key="progress" disabled={loading} onClick={() => handleStatusChange('W_TRAKCIE')}>
          Move to In Progress
        </MenuItem>
      );
    }
    if (selectedTask.status !== 'ZAKONCZONE') {
      items.push(
        <MenuItem key="complete" disabled={loading} onClick={() => handleStatusChange('ZAKONCZONE')}>
          Move to Completed
        </MenuItem>
      );
    }
    return items;
  };

  // Get menu items only once to prevent multiple calls
  const statusMenuItems = getStatusMenuItems();
  const hasStatusMenuItems = statusMenuItems.length > 0;

  // Styl dla obszaru upuszczania
  const getDropBackgroundColor = () => {
    if (!isOver) return 'transparent';
    return canDrop ? 'rgba(25, 118, 210, 0.1)' : 'rgba(211, 47, 47, 0.1)';
  };

  const dropStyle = {
    backgroundColor: getDropBackgroundColor(),
    transition: 'background-color 0.2s ease',
    borderRadius: 1,
    height: '100%'
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setDetailDialogOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...sx }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: getStatusColor(status),
        borderBottom: `2px solid ${getStatusColor(status) === 'default' ? '#ccc' : ''}`
      }}>
        {title || 'Task List'}
        <Chip 
          label={tasks.length} 
          size="small" 
          color={getStatusColor(status)}
          sx={{ ml: 1 }}
        />
      </Typography>
      
      {/* Obszar upuszczania */}
      <Box 
        ref={drop} 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          ...dropStyle
        }}
      >
        {tasks.length === 0 ? (
          <Typography 
            color="textSecondary" 
            sx={{ p: 2, textAlign: 'center' }}
          >
            {emptyMessage || 'No tasks available.'}
          </Typography>
        ) : (
          <List>
            {tasks.map((task, index) => (
              <DraggableTask
                key={task.id}
                task={task}
                index={index}
                onMenuOpen={handleMenuOpen}
                onTaskClick={handleTaskClick}  // Add this line
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
              />
            ))}
          </List>
        )}
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {/* Render status menu items */}
        {statusMenuItems}
        
        {/* Only show divider if there are status items */}
        {hasStatusMenuItems && <Divider />}
        
        <MenuItem disabled={loading} onClick={() => handlePriorityChange('NISKI')}>
          Priority: Low
        </MenuItem>
        <MenuItem disabled={loading} onClick={() => handlePriorityChange('ZWYKŁY')}>
          Priority: Normal
        </MenuItem>
        <MenuItem disabled={loading} onClick={() => handlePriorityChange('WYSOKI')}>
          Priority: High
        </MenuItem>
        <Divider />
        <MenuItem disabled={loading} onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <TaskDetailDialog 
        open={detailDialogOpen}
        taskId={selectedTaskId}
        onClose={() => setDetailDialogOpen(false)}
        onTaskUpdated={onTaskUpdated}
      />
    </Box>
  );
}

export default TaskList;
