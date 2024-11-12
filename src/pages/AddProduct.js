import React from 'react';
import { Paper, Typography } from '@mui/material';

function AddProduct() {
  return (
    <Paper
      sx={{
        padding: 3,
        backgroundColor: 'white',
        minHeight: '81vh',
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 2, 
        boxShadow: 3, 
      }}
    >
      <Typography variant="h4" sx={{ color: '#9E4BDC', fontWeight: 'bold' }}>
         AddProduct
      </Typography>
      <div>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Hello, this is your AddProduct .
        </Typography>
      </div>
    </Paper>
  );
}

export default AddProduct;
