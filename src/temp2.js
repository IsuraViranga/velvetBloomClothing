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
  galleryImages: [], // Ensure galleryImages is always an array
  variations: [], // New field for product variations
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
    case 'ADD_VARIATION':
      return { ...state, variations: [...state.variations, { size: '', colors: [] }] };
    case 'SET_VARIATION_SIZE':
      return {
        ...state,
        variations: state.variations.map((variation, index) =>
          index === action.index ? { ...variation, size: action.value } : variation
        )
      };
    case 'ADD_COLOR_COUNT':
      return {
        ...state,
        variations: state.variations.map((variation, index) =>
          index === action.index
            ? { ...variation, colors: [...variation.colors, { color: '', count: 0 }] }
            : variation
        )
      };
    case 'SET_COLOR_COUNT':
      return {
        ...state,
        variations: state.variations.map((variation, varIndex) =>
          varIndex === action.variationIndex
            ? {
                ...variation,
                colors: variation.colors.map((colorObj, colorIndex) =>
                  colorIndex === action.colorIndex
                    ? { ...colorObj, [action.field]: action.value }
                    : colorObj
                )
              }
            : variation
        )
      };
    default:
      return state;
  }
}

function AddProduct() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    // Regex validation for positive numbers
    const numberPattern = /^[1-9]\d*$/;

    // Validate variations
    for (const variation of state.variations) {
      if (!variation.size) {
        alert("Please select a size for all variations.");
        return;
      }
      for (const colorObj of variation.colors) {
        if (!colorObj.color || !numberPattern.test(colorObj.count)) {
          alert("Please ensure each color has a valid name and positive count.");
          return;
        }
      }
    }

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
      
      // Ensure galleryImages is not undefined and is always an array
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
            {/* Existing fields */}
            {/* Product Variation Section */}
            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Product Variation
            </Typography>
            <Button
              variant="outlined"
              onClick={() => dispatch({ type: 'ADD_VARIATION' })}
              sx={{ marginBottom: 2 }}
            >
              Add Size
            </Button>
            {Array.isArray(state.variations) && state.variations.map((variation, index) => (
              <div key={index}>
                <TextField
                  select
                  fullWidth
                  label="Size"
                  value={variation.size}
                  onChange={(e) => dispatch({ type: 'SET_VARIATION_SIZE', index, value: e.target.value })}
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="XXL">XXL</MenuItem>
                </TextField>
                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'ADD_COLOR_COUNT', index })}
                  sx={{ marginBottom: 2 }}
                >
                  Add Color & Count
                </Button>
                {Array.isArray(variation.colors) && variation.colors.map((colorObj, colorIndex) => (
                  <Row key={colorIndex} className="mb-2">
                    <Col>
                      <TextField
                        label="Color"
                        value={colorObj.color}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_COLOR_COUNT',
                            variationIndex: index,
                            colorIndex,
                            field: 'color',
                            value: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Col>
                    <Col>
                      <TextField
                        label="Count"
                        value={colorObj.count}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_COLOR_COUNT',
                            variationIndex: index,
                            colorIndex,
                            field: 'count',
                            value: e.target.value,
                          })
                        }
                        fullWidth
                        inputProps={{ pattern: '^[1-9]\\d*$' }} // Validates positive integers
                      />
                    </Col>
                  </Row>
                ))}
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
