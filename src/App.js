import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Users from './pages/Users';
import Workstations from './pages/Workstations';
import { ThemeProvider } from './context/ThemeContext';

// Set drawer width - must match the value in NavBar.js
const drawerWidth = 240;

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` }
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/workstations" element={<Workstations />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
