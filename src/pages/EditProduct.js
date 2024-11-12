import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditProduct() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    
    fetchProduct();
  }, [id]);

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
        Edit Product
      </Typography>
      {product ? (
        <div>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Product Name: {product.productName}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Price: ${product.unitPrice}
          </Typography>
        </div>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Loading product details...
        </Typography>
      )}
    </Paper>
  );
}

export default EditProduct;
