import React from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Divider
} from '@mui/material';

function TaskList({ tasks }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'NOWE': return 'info';
      case 'W_TRAKCIE': return 'warning';
      case 'ZAKONCZONE': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Task List
      </Typography>
      {tasks.length === 0 ? (
        <Typography color="textSecondary">No tasks available.</Typography>
      ) : (
        <List>
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText 
                  primary={task.name} 
                  secondary={`Client ID: ${task.client_id}`} 
                />
                <Chip 
                  label={task.status} 
                  color={getStatusColor(task.status)} 
                  size="small" 
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default TaskList;
