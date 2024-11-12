import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function AddCategory() {
  const navigate = useNavigate(); 

  // State variables for form inputs
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  // Handle change for the category name
  const handleCategoryNameChange = (e) => setCategoryName(e.target.value);

  // Handle change for the description
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Handle file input change for the image
  const handleImageChange = (e) => setMainImage(e.target.files[0]);

  // Handle the add button click
  const handleAddCategory = async () => {
    if (!categoryName || !description || !mainImage) {
      alert('Please fill in all fields and upload an image');
      return;
    }

    // Prepare FormData to send the data as multipart form data
    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('description', description);
    formData.append('mainImage', mainImage);

    try {
      const response = await axios.post('http://your-backend-api-url/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setOpenSuccessDialog(true);
      }
    } catch (error) {
      console.error('There was an error adding the category!', error);
      alert('Error adding category. Please try again.');
    }
  };

  // Close the success dialog
  const handleCloseSuccessDialog = () => setOpenSuccessDialog(false);

  // Navigate back to the category page using navigate
  const handleBack = () => {
    navigate('/category'); 
  };

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
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'space-between', 
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ color: '#9E4BDC', fontWeight: 'bold' }}>
          Add Category
        </Typography>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 2 }}
          value={categoryName}
          onChange={handleCategoryNameChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ marginTop: 2 }}
          value={description}
          onChange={handleDescriptionChange}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ color: '#9E4BDC', fontWeight: 'bold' }}>
          Category Main Image
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: 10 }}
        />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Add
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </Button>
      </Box>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Category Added</DialogTitle>
        <DialogContent>
          <Typography>Category has been added successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AddCategory;
