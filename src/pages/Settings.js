// src/pages/Dashboard.js
import React from 'react';
import { Paper, Typography } from '@mui/material';

function Settings() {
  return (
    <Paper
      sx={{
        padding: 3,
        backgroundColor: 'white',
        minHeight: '81vh',
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 2, // Optional: Add some rounded corners
        boxShadow: 3, // Optional: Add shadow for elevated effect
      }}
    >
      <Typography variant="h4" sx={{ color: '#9E4BDC', fontWeight: 'bold' }}>
       Settings
      </Typography>
      <div>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Hello, this is your Settings.
        </Typography>
      </div>
    </Paper>
  );
}
export default Settings;
