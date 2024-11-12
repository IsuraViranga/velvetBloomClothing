import React, { useReducer } from 'react';
import { Paper, Typography, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
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
  galleryImages: [],
  variations: [],
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
        galleryImages: state.galleryImages.filter((_, index) => index !== action.index),
      };
    case 'ADD_VARIATION':
      return {
        ...state,
        variations: [
          ...state.variations,
          { size: '', colors: [{ color: '', count: 0 }] },
        ],
      };
    case 'SET_VARIATION_SIZE':
      const updatedVariations = [...state.variations];
      updatedVariations[action.index].size = action.value;
      return { ...state, variations: updatedVariations };
    case 'SET_COLOR_COUNT':
      const updatedVariationsColor = [...state.variations];
      updatedVariationsColor[action.index].colors[action.colorIndex][action.field] =
        action.value;
      return { ...state, variations: updatedVariationsColor };
    case 'ADD_COLOR':
      const newVariationWithColor = [...state.variations];
      newVariationWithColor[action.index].colors.push({ color: '', count: 0 });
      return { ...state, variations: newVariationWithColor };
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
      formData.append('variations', JSON.stringify(state.variations)); 

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
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Apparel">Apparel</MenuItem>
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
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Discount</Typography>
            <TextField
              fullWidth
              type="number"
              value={state.discount}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'discount', value: Number(e.target.value) })}
              sx={{ marginTop: 1 }}
            />
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold' }}>Product Main Image</Typography>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => dispatch({ type: 'SET_MAIN_IMAGE', value: e.target.files[0] })}
              sx={{ marginTop: 1 }}
            />
            {state.mainImage && (
              <div style={{ position: 'relative', marginTop: '10px' }}>
                <img
                  src={URL.createObjectURL(state.mainImage)}
                  alt="Main Product"
                  style={{ width: '40%', height: 'auto', borderRadius: '4px' }}
                />
                <IconButton
                  onClick={() => dispatch({ type: 'SET_MAIN_IMAGE', value: null })}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </div>
            )}
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
            <Row className="mt-2">
              {state.galleryImages.map((image, index) => (
                <Col xs={4} key={index} style={{ position: 'relative', marginBottom: '10px' }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`gallery-${index}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                  <IconButton
                    onClick={() => dispatch({ type: 'REMOVE_GALLERY_IMAGE', index })}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Col>
              ))}
            </Row>
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 4 }}>
              Product Variation
            </Typography>
            <Button
              variant="outlined"
              onClick={() => dispatch({ type: 'ADD_VARIATION' })}
              sx={{ marginTop: 2 ,marginLeft: 2}}
            >
              Add Variation
            </Button>
            {state.variations.map((variation, index) => (
              <div key={index}>
                <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
                  Size
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={variation.size}
                  onChange={(e) =>
                    dispatch({ type: 'SET_VARIATION_SIZE', index, value: e.target.value })
                  }
                  sx={{ marginTop: 1 }}
                >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="XXL">XXL</MenuItem>
                </TextField>

                {variation.colors.map((color, colorIndex) => (
                  <div key={colorIndex}>
                    <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
                      Color
                    </Typography>
                    <TextField
                      fullWidth
                      label="Color"
                      value={color.color}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_COLOR_COUNT',
                          index,
                          colorIndex,
                          field: 'color',
                          value: e.target.value,
                        })
                      }
                      sx={{ marginTop: 1 }}
                    />
                    <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
                      Count
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={color.count}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_COLOR_COUNT',
                          index,
                          colorIndex,
                          field: 'count',
                          value: e.target.value,
                        })
                      }
                      sx={{ marginTop: 1 }}
                    />
                  </div>
                ))}

                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'ADD_COLOR', index })}
                  sx={{ marginTop: 2 }}
                >
                  Add Color
                </Button>
              </div>
            ))}
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
