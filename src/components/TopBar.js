import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function TopBar() {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white' }}>
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Typography variant="h6" sx={{ color: '#9E4BDC' }}>
          Hi Admin
        </Typography>
        <IconButton color="inherit" sx={{ color: '#9E4BDC' }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
