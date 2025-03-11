import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ListItem, ListItemText, Box, Divider, Chip, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IconButton from '@mui/material/IconButton';

function DraggableTask({ task, index, onMenuOpen, onTaskClick, getPriorityColor, getPriorityLabel }) {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  
  // Apply the drag ref to our component
  drag(ref);
  
  // Native JS date formatting
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get the latest comment and count
  const latestComment = task.Comments && task.Comments.length > 0 ? task.Comments[0] : null;
  const commentCount = task.get?.('commentCount') || (task.Comments?.length || 0);
  
  return (
    <>
      {index > 0 && <Divider />}
      <ListItem
        ref={ref}
        onClick={() => onTaskClick && onTaskClick(task.id)}
        sx={{ 
          opacity: isDragging ? 0.4 : 1,
          cursor: 'grab',
          '&:hover': { backgroundColor: 'action.hover' },
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
        secondaryAction={
          <IconButton edge="end" onClick={(e) => onMenuOpen(e, task)}>
            <MoreVertIcon />
          </IconButton>
        }
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {task.priority && (
                <FlagIcon 
                  fontSize="small"
                  sx={{ 
                    color: getPriorityColor(task.priority),
                    mr: 1
                  }}
                />
              )}
              {task.name}
            </Box>
          }
          secondary={
            <>
              {task.Workstation && `${task.Workstation.name}`}
              {task.priority && ` • ${getPriorityLabel(task.priority)}`}
            </>
          }
        />
        
        {/* Comment section */}
        {commentCount > 0 && (
          <Box sx={{ 
            mt: 1, 
            pt: 1, 
            borderTop: '1px dashed rgba(0, 0, 0, 0.12)',
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
              <Typography variant="caption" color="textSecondary">
                {commentCount > 1 ? `${commentCount} comments` : '1 comment'}
              </Typography>
            </Box>
            
            {latestComment && (
              <Box sx={{ 
                backgroundColor: 'background.default',
                borderRadius: 1,
                p: 1
              }}>
                <Typography variant="caption" color="textSecondary">
                  {formatTime(latestComment.created_at)}:
                </Typography>
                <Typography variant="body2" sx={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {latestComment.content}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </ListItem>
    </>
  );
}

export default DraggableTask;