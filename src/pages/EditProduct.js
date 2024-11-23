import React, {  useEffect, useReducer, useState  } from 'react';
import {Snackbar, Alert,FormHelperText, Menu,Box ,Paper, Typography, TextField, Button, MenuItem, IconButton,FormGroup, FormControlLabel, Checkbox,FormControl,FormLabel  } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {tempEditProduct} from '../TemporaryData/editProductData';
import boy from '../assets/boy.jpg';
import boy2 from '../assets/boy.jpg';
import boy3 from '../assets/boy.jpg';

const initialState = {
  productName: 'ggrg',
  category: ["Clothing", "Unisex", "Sweatshirts"],
  lowStockCount: 0,
  brand: '',
  unitPrice: 0,
  discount: 0,
  productCount: 0,
  description: '',
  productStatus: '',
  mainImage: null,
  galleryImages: [],
  variations: [{ size: '', colors: [{ color: '', count: 0 }] }],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return action.data;
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
      console.log('ADD_COLOR action dispatched');
      const newVariationWithColor = [...state.variations];
      newVariationWithColor[action.index].colors.push({ color: '', count: 0 });
      return { ...state, variations: newVariationWithColor };
    case 'ADD_CATEGORY':
      return{...state,category:[...state.category,action.value]}
    case 'REMOVE_CATEGORY':
      return{...state, category: state.category.filter((_, index) => index !== action.index)}
    default:
      return state;
  }
}

function EditProduct() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullCategoryList, setFullCategoryList] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  //Determine the product status
  const getStatus = (availableCount, lowStockCount) => {
    if (availableCount === 0) return 'Out of Stock';
    if (availableCount < lowStockCount) return 'Low Stock';
    return 'In Stock';
  };

  useEffect(() => {
      const fetchFulllCategoryList = async () => {
        try {
          // const response = await axios.get(`/api/categories`);
          // const productData = response.data;
          //setFullCategoryList(productData);
          const clothingCategories = [
            "Clothing",
            "Unisex",
            "Sweatshirts",
            "Shirts",
            "T-Shirts",
            "Jackets",
            "Pants",
            "Shorts",
            "Dresses",
            "Activewear"
          ];          
          setFullCategoryList(clothingCategories);
        } catch (error) {
          console.error('Error fetching list of categories:', error);
        }
      };
      fetchFulllCategoryList();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          // const response = await axios.get(`/api/products/${id}`);
          // const productData = response.data;
          const productData = tempEditProduct;
          console.log(state.mainImage);
            dispatch({
              type: 'SET_INITIAL_DATA',
              data: {
                productName: productData.productName,
                category: productData.categories,
                lowStockCount: productData.lowStockCount,
                brand: productData.brand,
                unitPrice: productData.unitPrice,
                discount: productData.discount,
                productCount:productData.productCount,
                description: productData.description,
                productStatus: getStatus(productData.productCount, productData.lowStockCount),
                mainImage: productData.mainImgUrl,
                galleryImages: productData.imageGallery,
                variations: productData.variety,
              },
            });
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    // Product name validation
    if (!state.productName.trim()) {
      newErrors.productName = 'Product name cannot be empty.';
    } else if (!/^[a-zA-Z\s]{3,}$/.test(state.productName)) {
      newErrors.productName = 'Product name must contain at least three letters.';
    }

    // Brand validation
    if (!state.brand.trim()) {
      newErrors.brand = 'Brand name cannot be empty.';
    } else if (!/^[a-zA-Z\s]+$/.test(state.brand)) {
      newErrors.brand = 'Brand name can only contain letters.';
    }

    // Variations validation
    state.variations.forEach((variation, index) => {
      if (!variation.size) {
        newErrors[`variations[${index}].size`] = `Size cannot be empty for variation ${index + 1}.`;
      }
  
      variation.colors.forEach((color, colorIndex) => {
        if (!color.color.trim()) {
          newErrors[`variations[${index}].colors[${colorIndex}].color`] = `Color cannot be empty in variation ${index + 1}, color ${colorIndex + 1}.`;
        } else if (color.color.length < 3) {
          newErrors[`variations[${index}].colors[${colorIndex}].color`] = `Color must have at least 3 letters in variation ${index + 1}, color ${colorIndex + 1}.`;
        }
        if (color.count <= 0) {
          newErrors[`variations[${index}].colors[${colorIndex}].count`] = `Count must be greater than 0 in variation ${index + 1}, color ${colorIndex + 1}.`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {  
      if (!validateForm()) {
        setSnackbar({
          open: true,
          message: 'Please fix the errors before submitting.',
          severity: 'error',
        });
        return;
      }
      const formData = new FormData();
      formData.append('productName', state.productName);
      formData.append('categories', JSON.stringify(state.category));
      formData.append('lowStockCount', state.lowStockCount);
      formData.append('brand', state.brand);
      formData.append('unitPrice', state.unitPrice);
      formData.append('discount', state.discount);
      formData.append('productCount', state.productCount);
      formData.append('description', state.description);
      formData.append('mainImage', state.mainImage);
      state.galleryImages.forEach((image, index) => {
        formData.append(`imageGallery[${index}]`, image);
      });
      formData.append('variety', JSON.stringify(state.variations));

      if (id) {
        await axios.put(`/api/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully!');
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success',
        });
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Failed to submit product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update product.',
        severity: 'error',
      });
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      dispatch({
        type: 'ADD_CATEGORY',
        value: category,
      });
    } else {
      const categoryIndex = state.category.indexOf(category);
      if (categoryIndex !== -1) {
        dispatch({
          type: 'REMOVE_CATEGORY',
          index: categoryIndex,
        });
      }
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        Edit Product
      </Typography>
      <Container className="mt-4">
        <Row>
        <Col md={6} sm={12}>
            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold' }}>
              Product Name
            </Typography>
            <TextField
              fullWidth
              value={state.productName}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'productName', value: e.target.value })
              }
              error={!!errors.productName}
              helperText={errors.productName}
              sx={{ marginTop: 1 }}
            />
            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Categories
            </Typography>
            <Button
              variant="outlined"
              onClick={handleOpen}
              sx={{ marginTop: 1 }}
            >
              Select Categories
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <FormLabel component="legend">Select Categories</FormLabel>
              </MenuItem>
              <MenuItem>
                <FormGroup>
                  {fullCategoryList.map((category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={state.category.includes(category)}
                          onChange={(e) =>
                            handleCategoryChange(category, e.target.checked)
                          }
                        />
                      }
                      label={category}
                    />
                  ))}
                </FormGroup>
              </MenuItem>
            </Menu>
            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Low Stock Count
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={state.lowStockCount}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'lowStockCount', value: Math.max(0, Number(e.target.value)) })
              }
              sx={{ marginTop: 1 }}
            />
            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Product Count
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={state.productCount}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'productCount', value: Math.max(0, Number(e.target.value))  })
              }
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Unit Price
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={state.unitPrice}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'unitPrice', value: Math.max(0, Number(e.target.value)) })
              }
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Brand
            </Typography>
            <TextField
              fullWidth
              value={state.brand}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'brand', value: e.target.value })
              }
              error={!!errors.brand}
              helperText={errors.brand}
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={state.description}
              onChange={(e) =>
                dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })
              }
              sx={{ marginTop: 1 }}
            />

            <Typography variant="h6" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>
              Product Status
            </Typography>
            <Box
              sx={{
                marginTop: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                color: '#000',
              }}
            >
              {state.productStatus || 'No Status Available'}
            </Box>
          </Col>
          <Col md={6} sm={12}>
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold', marginTop: 2 }}>Discount</Typography>
            <TextField
              fullWidth
              type="number"
              value={state.discount}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'discount', value: Math.max(0, Number(e.target.value)) })}
              sx={{ marginTop: 1 }}
            />
            <Typography variant="h7" sx={{ color: 'Black', fontWeight: 'bold' }}>Product Main Image</Typography>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  dispatch({ type: 'SET_MAIN_IMAGE', value: file });
                }
              }}
              sx={{ marginTop: 1 }}
            />
            {state.mainImage && state.mainImage instanceof File && (
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
                Array.from(e.target.files).forEach((file) => {
                  if (file) {
                    dispatch({ type: 'ADD_GALLERY_IMAGE', value: file });
                  }
                });
              }}
              sx={{ marginTop: 1 }}
            />
            <Row className="mt-2">
              {state.galleryImages.map((image, index) => (
                <Col xs={4} key={index} style={{ position: 'relative', marginBottom: '10px' }}>
                  {image instanceof File && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`gallery-${index}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                  )}
                  <IconButton
                    onClick={() => {
                      dispatch({ type: 'REMOVE_GALLERY_IMAGE', index });
                      URL.revokeObjectURL(image);
                    }}
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
                  error={!!errors[`variations[${index}].size`]}
                  helperText={errors[`variations[${index}].size`] || ''}
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
                      error={!!errors[`variations[${index}].colors[${colorIndex}].color`]}
                      helperText={errors[`variations[${index}].colors[${colorIndex}].color`] || ''}
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
                      error={!!errors[`variations[${index}].colors[${colorIndex}].count`]}
                      helperText={errors[`variations[${index}].colors[${colorIndex}].count`] || ''}
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
          Save Changes
        </Button>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Paper>
  );
}

export default EditProduct;
