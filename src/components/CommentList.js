import React from 'react';
import { 
  List, 
  ListItem, 
  Typography, 
  Box, 
  Divider, 
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CommentList({ comments, onDeleteComment }) {
  if (!comments || comments.length === 0) {
    return <Typography color="textSecondary" sx={{ mt: 2 }}>No comments yet</Typography>
  }
  
  // Native JS date formatting
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <List sx={{ width: '100%' }}>
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          {index > 0 && <Divider />}
          <ListItem 
            alignItems="flex-start"
            secondaryAction={
              onDeleteComment && (
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )
            }
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  component="span"
                  sx={{ fontWeight: 'bold', mr: 1 }}
                >
                  {comment.User?.username || 'Anonymous'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="textSecondary"
                >
                  {formatTime(comment.created_at)}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                component="p"
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {comment.content}
              </Typography>
            </Box>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
}

export default CommentList;