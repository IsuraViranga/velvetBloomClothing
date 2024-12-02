import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

function OrderManagement() {
  const [orders, setOrders] = useState([]); // Orders data
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [loading, setLoading] = useState(true); // Loading state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Delete dialog
  const [orderToDelete, setOrderToDelete] = useState(null); // Selected order for deletion
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [totalItems, setTotalItems] = useState(0); // Total items count

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]); // Re-fetch when page or rows per page changes

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/orders?status=${statusFilter}&page=${page}&pageSize=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.orders);
      setTotalItems(response.data.totalItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to the first page
    fetchOrders(); // Refetch orders
  };

  const handleOpenDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOrderToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/orders/${orderToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter((order) => order.id !== orderToDelete));
      handleCloseDeleteDialog();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <Paper
      sx={{
        padding: 3,
        backgroundColor: "white",
        minHeight: "81vh",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order Management
      </Typography>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          label="Status Filter"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ordered">Ordered</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.contactName}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(order.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteOrder}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default OrderManagement;
