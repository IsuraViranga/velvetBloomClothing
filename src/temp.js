import React, { useReducer } from 'react';
import { Paper, Typography, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';

const initialState = {
  productName: '',
  category: '',
  lowStockCount: 0,
  brand: '',
  unitPrice: 0,
  discount: 0,
  visibility: '',
  description: '',
  productStatus: 'active',
  mainImage: null,
  galleryImages: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_MAIN_IMAGE':
      return { ...state, mainImage: action.value };
    case 'ADD_GALLERY_IMAGE':
      return { ...state, galleryImages: [...state.galleryImages, action.value] };
    case 'REMOVE_GALLERY_IMAGE':
      return {
        ...state,
        galleryImages: state.galleryImages.filter((_, index) => index !== action.index)
      };
    default:
      return state;
  }
}

function AddProduct() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('productName', state.productName);
      formData.append('category', state.category);
      formData.append('lowStockCount', state.lowStockCount);
      formData.append('brand', state.brand);
      formData.append('unitPrice', state.unitPrice);
      formData.append('discount', state.discount);
      formData.append('visibility', state.visibility);
      formData.append('description', state.description);
      formData.append('productStatus', state.productStatus);
      formData.append('mainImage', state.mainImage);
      state.galleryImages.forEach((image, index) => {
        formData.append(`galleryImages[${index}]`, image);
      });

      const response = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <Paper
      sx={{
        padding: 3,
        backgroundColor: 'white',
        minHeight: '86vh',
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" sx={{ color: '#9E4BDC', fontWeight: 'bold', marginLeft: 1 }}>
        New Product
      </Typography>
      <Container className="mt-4">
        <Row>
          <Col md={6} sm={12}>
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold' }}>Product Name</Typography>
            <TextField
              fullWidth
              value={state.productName}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'productName', value: e.target.value })}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Category</Typography>
            <TextField
              fullWidth
              select
              value={state.category}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })}
              sx={{ marginTop: 1 }}
            >
              {/* Populate these options from backend */}
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Apparel">Apparel</MenuItem>
              {/* More categories */}
            </TextField>

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Low Stock Count</Typography>
            <TextField
              fullWidth
              type="number"
              value={state.lowStockCount}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'lowStockCount', value: Number(e.target.value) })}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Unit Price</Typography>
            <TextField
              fullWidth
              type="number"
              value={state.unitPrice}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'unitPrice', value: Number(e.target.value) })}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={state.description}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Product Status</Typography>
            <TextField
              fullWidth
              select
              value={state.productStatus}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'productStatus', value: e.target.value })}
              sx={{ marginTop: 1 }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Col>

          <Col md={6} sm={12}>
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold' }}>Product Main Image</Typography>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => dispatch({ type: 'SET_MAIN_IMAGE', value: e.target.files[0] })}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Product Gallery</Typography>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: 'image/*', multiple: true }}
              onChange={(e) => {
                Array.from(e.target.files).forEach((file) =>
                  dispatch({ type: 'ADD_GALLERY_IMAGE', value: file })
                );
              }}
              sx={{ marginTop: 1 }}
            />
            <Row>
              {state.galleryImages.map((img, index) => (
                <Col key={index} md={4} className="mt-2">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="gallery-img"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <Button
                    color="error"
                    onClick={() => dispatch({ type: 'REMOVE_GALLERY_IMAGE', index })}
                  >
                    Remove
                  </Button>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Button
          variant="contained"
          sx={{ marginTop: 3, backgroundColor: '#9E4BDC' }}
          onClick={handleSubmit}
        >
          Add New Product
        </Button>
      </Container>
    </Paper>
  );
}

export default AddProduct;
