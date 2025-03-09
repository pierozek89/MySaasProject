import React, { useEffect, useState } from 'react';
import API from '../api';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Box,
  Chip,
  Divider
} from '@mui/material';

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'PRACOWNIK',
    password: '',
    client_id: 1,
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', newUser);
      setNewUser({
        username: '',
        email: '',
        role: 'PRACOWNIK',
        password: '',
        client_id: 1,
      });
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users Management
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New User
            </Typography>
            <Box component="form" onSubmit={createUser} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <MenuItem value="ADMIN_SYSTEMU">ADMIN_SYSTEMU</MenuItem>
                  <MenuItem value="POWER_USER">POWER_USER</MenuItem>
                  <MenuItem value="PRACOWNIK">PRACOWNIK</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Client ID"
                type="number"
                value={newUser.client_id}
                onChange={(e) =>
                  setNewUser({ ...newUser, client_id: parseInt(e.target.value, 10) })
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create User
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User List
            </Typography>
            <List>
              {users.map((user, index) => (
                <React.Fragment key={user.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={user.username}
                      secondary={user.email || 'No Email'}
                    />
                    <Chip 
                      label={user.role} 
                      color={user.role === 'ADMIN_SYSTEMU' ? 'error' : 
                             user.role === 'POWER_USER' ? 'warning' : 'primary'} 
                      size="small" 
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Users;
