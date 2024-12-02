import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Grid, Button, TextField, MenuItem, Select, InputLabel, FormControl,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import { productList } from '../TemporaryData/productManagementData';
 
function transformProductData(productList) {
  return productList.map(product => ({
    _id:product.id,
    productName: product.productName,
    AvailableCount: product.productCount,
    LowStockCount: product.lowStockCount,
    unitPrice: product.unitPrice,
    categories: product.categories
  }));
}
 
function ProjectManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    categories: 5,
    totalProducts: 50,
    inStock: 30,
    lowStock: 15,
    outOfStock: 5,
  }); 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [status, setStatus] = useState('All');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch data for the stats summary
  useEffect(() => {
    async function fetchStats() {
      try {
        const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzMzMDM3MzAwLCJleHAiOjE3MzMxMjM3MDB9.FeTUTXVmcp6hw4dhatr5x0JXvGTEt55z8phufnNLDS0';
        const response =await axios.get(`http://localhost:8080/inventories/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }
    fetchStats();
  }, []);

  // Fetch products with pagination
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8080/products');        
        const productList = response.data;
        const ArrangedProducts = transformProductData(productList);
        const paginatedProducts = ArrangedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setProducts(ArrangedProducts); 
        setFilteredProducts(paginatedProducts); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, [page, rowsPerPage]);

  // Determine the product status
  const getStatus = (availableCount, lowStockCount) => {
    if (availableCount === 0) return 'Out of Stock';
    if (availableCount < lowStockCount) return 'Low Stock';
    return 'In Stock';
  };

  // Filter products based on search criteria
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesName = product.productName.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory = product.categories.some((category) =>
        category.toLowerCase().includes(searchCategory.toLowerCase())
      );
      const matchesStatus = status === 'All' || getStatus(product.AvailableCount, product.LowStockCount) === status;
      return matchesName && matchesCategory && matchesStatus;
    });
    setFilteredProducts(filtered);
  }, [searchName, searchCategory, status, products]);

  // Pagination controls
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setProductToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    try {
      const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzMzMDM3MzAwLCJleHAiOjE3MzMxMjM3MDB9.FeTUTXVmcp6hw4dhatr5x0JXvGTEt55z8phufnNLDS0';
      await axios.delete(`http://localhost:8080/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== productToDelete));
      setFilteredProducts(filteredProducts.filter((product) => product._id !== productToDelete));
      handleCloseDeleteDialog();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Paper sx={{ padding: 3, backgroundColor: 'white', minHeight: '81vh', marginTop: 2, marginLeft: 2, marginRight: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Overall Inventory</Typography>

      {/* Stats Section */}
      <Grid container spacing={1} sx={{ marginBottom: 4 }}>
        {['Categories', 'Total Products', 'In Stock', 'Low Stock', 'Out of Stock'].map((label, index) => (
          <Grid item xs={2.4} key={label}>
            <Paper sx={{ padding: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="subtitle1">{label}</Typography>
              <Typography variant="h6">{Object.values(stats)[index]}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Products Section */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2, marginTop: 7 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Products</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#9E4BDC',
            '&:hover': { backgroundColor: '#7B3CB8' },
          }}
          onClick={() => navigate('/add-product')}
        >
          Add Product
        </Button>
      </Grid>

      {/* Search Bars and Status Dropdown */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Search by Product Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Search by Category Name"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Available Count</TableCell>
              <TableCell>Low Stock Count</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id} data-testid="product-row">
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.AvailableCount}</TableCell>
                <TableCell>{product.LowStockCount}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>{getStatus(product.AvailableCount, product.LowStockCount)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/edit-product/${product._id}`)} data-testid="EditIcon">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(product._id)} data-testid="DeleteIcon">
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ProjectManagement;
