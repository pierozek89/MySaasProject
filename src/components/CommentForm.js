import React, { useState } from 'react';
import API from '../api';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function CommentForm({ taskId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await API.post(`/comments/task/${taskId}`, { 
        content,
        // In a real app, you would get the current user ID from context/auth state
        user_id: localStorage.getItem('userId') || null
      });
      setContent('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-end',
        mt: 2 
      }}
    >
      <TextField
        multiline
        minRows={1}
        maxRows={4}
        fullWidth
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
        size="small"
        disabled={loading}
      />
      <Button 
        type="submit"
        variant="contained" 
        color="primary"
        disabled={loading || !content.trim()}
        sx={{ ml: 1, minWidth: 'auto' }}
      >
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </Button>
    </Box>
  );
}

export default CommentForm;