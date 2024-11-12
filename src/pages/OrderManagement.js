import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Grid, Button, TextField, Select,
  InputLabel, FormControl, MenuItem, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState(null);
  const [status, setStatus] = useState('All');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Fetch orders from the API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get('/api/orders');
        const fetchedOrders = response.data;
        // Merge the mock orders with the fetched data
        const mockOrders = generateMockOrders(50);
        setOrders([...fetchedOrders, ...mockOrders]);
        setFilteredOrders([...fetchedOrders, ...mockOrders]);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // If the API fails, show mock data
        const mockOrders = generateMockOrders(50);
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      }
    }
    fetchOrders();
  }, []);

  // Generate mock data
  const generateMockOrders = (count) => {
    const statuses = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
    const paymentMethods = ['Credit Card', 'PayPal', 'Cash'];
    return Array.from({ length: count }, (_, i) => ({
      orderID: `MOCK${i + 1}`,
      Date: `2024-11-${String(i % 30 + 1).padStart(2, '0')}`,
      Status: statuses[i % statuses.length],
      CustomerName: `Customer ${i + 1}`,
      Items: `${Math.floor(Math.random() * 10) + 1} items`,
      Total: `${(Math.random() * 1000 + 100).toFixed(2)}`,
      PayMethod: paymentMethods[i % paymentMethods.length],
    }));
  };

  // Filter orders based on search criteria
  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesName = order.CustomerName.toLowerCase().includes(searchName.toLowerCase());
      const matchesDate = !searchDate || order.Date === searchDate.toISOString().slice(0, 10); // Adjust format as needed
      const matchesStatus = status === 'All' || order.Status === status;
      
      return matchesName && matchesDate && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [searchName, searchDate, status, orders]);

  // Pagination controls
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open edit dialog
  const handleOpenEditDialog = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrderToEdit(response.data);
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setOrderToEdit(null);
    setOpenEditDialog(false);
  };

  // Save edited order
  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/orders/${orderToEdit.orderID}`, orderToEdit);
      setOrders(orders.map(order => order.orderID === orderToEdit.orderID ? orderToEdit : order));
      setFilteredOrders(filteredOrders.map(order => order.orderID === orderToEdit.orderID ? orderToEdit : order));
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOrderToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Delete order
  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`/api/orders/${orderToDelete}`);
      setOrders(orders.filter(order => order.orderID !== orderToDelete));
      setFilteredOrders(filteredOrders.filter(order => order.orderID !== orderToDelete));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <Paper sx={{ padding: 3, backgroundColor: 'white', minHeight: '81vh', marginTop: 2, marginLeft: 2, marginRight: 2, borderRadius: 2, boxShadow: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2, marginTop: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9E4BDC' }}>Order Management</Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#9E4BDC', '&:hover': { backgroundColor: '#7B3CB8' } }}
          onClick={() => navigate('/add-order')}
        >
          Create Order
        </Button>
      </Grid>

      {/* Search Bars */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Search by Customer Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Search by Date"
              value={searchDate}
              onChange={(newValue) => setSearchDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
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
              <MenuItem value="Ordered">Ordered</MenuItem>
              <MenuItem value="Packed">Packed</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total (LKR)</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <TableRow key={order.orderID}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{order.Date}</TableCell>
                <TableCell>{order.Status}</TableCell>
                <TableCell>{order.CustomerName}</TableCell>
                <TableCell>{order.Items}</TableCell>
                <TableCell>{order.Total}</TableCell>
                <TableCell>{order.PayMethod}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(order.orderID)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(order.orderID)}>
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          {/* Add your edit form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default OrderManagement;
