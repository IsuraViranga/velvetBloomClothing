import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCategory() {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  // Handle change for the category name
  const handleCategoryNameChange = (e) => setCategoryName(e.target.value);

  // Handle change for the description
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Handle file input change for the image
  const handleImageChange = (e) => setMainImage(e.target.files[0]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Regular expressions
    const lettersOnlyRegex = /^[a-zA-Z\s]+$/;

    // Validate category name
    if (!categoryName.trim()) {
      newErrors.categoryName = 'Category name cannot be empty.';
    } else if (categoryName.trim().length < 2) {
      newErrors.categoryName = 'Category name must be at least 2 characters.';
    } else if (!lettersOnlyRegex.test(categoryName)) {
      newErrors.categoryName = 'Category name can only contain letters.';
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Description cannot be empty.';
    } else if (description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters.';
    } else if (!lettersOnlyRegex.test(description)) {
      newErrors.description = 'Description can only contain letters.';
    }

    // Validate image
    if (!mainImage) {
      newErrors.mainImage = 'Main image cannot be empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle the add button click
  const handleAddCategory = async () => {
    if (!validateForm()){
      setSnackbar({
        open: true,
        message: 'Please fix the errors before adding.',
        severity: 'error',
      });
      return;
    };
    const category ={
      name:categoryName,
      description:description
    }
    const formData = new FormData();
    formData.append('category', JSON.stringify(category));
    formData.append('image', mainImage);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:8080/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Category added successfully!', severity: 'success' });
      }
      setCategoryName("");
      setDescription("");
      setMainImage(null);
    } catch (error) {
      console.error('There was an error adding the category!', error);
      setSnackbar({ open: true, message: 'Error adding category. Please try again.', severity: 'error' });
    }
  };

  // Close the snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
          name="categoryName"
          label="Category Name"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 2 }}
          value={categoryName}
          onChange={handleCategoryNameChange}
          error={!!errors.categoryName}
          helperText={errors.categoryName || ''}
        />
        <TextField
          name="descriptionn"
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ marginTop: 2 }}
          value={description}
          onChange={handleDescriptionChange}
          error={!!errors.description}
          helperText={errors.description || ''}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ color: '#9E4BDC', fontWeight: 'bold' }}>
          Category Main Image
        </Typography>
        <input
          name="file"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: 10 }}
        />
        {errors.mainImage && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errors.mainImage}
          </Typography>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleAddCategory} data-testid="add">
          Add
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack} data-testid="back">
          Back
        </Button>
      </Box>

      {/* Snackbar for success/failure messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AddCategory;
