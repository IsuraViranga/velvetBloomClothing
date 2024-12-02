import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import CloseIcon from "@mui/icons-material/Close";
import { blue, red, green, yellow } from "@mui/material/colors";

function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      _id: "1",
      createdAt: "2024-11-15",
      status: "Shipped",
      customerName: "Cody Fisher",
      items: [{ name: "Hoody", price: 12.5 }],
      color: "Red",
      size: "M",
      count: 2,
      total: 25.0,
      paymentMethod: "Card",
    },
    {
      _id: "2",
      createdAt: "2024-11-18",
      status: "Ordered",
      customerName: "Jane Doe",
      items: [{ name: "Hoody", price: 12.5 }],
      color: "Blue",
      size: "L",
      count: 1,
      total: 25.0,
      paymentMethod: "Cash",
    },
  ]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const displayedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenEditDialog = (order) => {
    setOrderToEdit(order);
    setEditDate(new Date(order.createdAt));
    setEditStatus(order.status);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOrderToEdit(null);
    setEditDate(null);
    setEditStatus("");
    setOpenEditDialog(false);
  };

  const handleSaveEdit = () => {
    if (editDate && editStatus) {
      const updatedOrder = {
        ...orderToEdit,
        createdAt: editDate.toISOString().slice(0, 10),
        status: editStatus,
      };
      setOrders(
        orders.map((order) =>
          order._id === orderToEdit._id ? updatedOrder : order
        )
      );
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderToEdit._id ? updatedOrder : order
        )
      );
      handleCloseEditDialog();
    }
  };

  const handleOpenDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOrderToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteOrder = () => {
    setOrders(orders.filter((order) => order._id !== orderToDelete));
    setFilteredOrders(
      filteredOrders.filter((order) => order._id !== orderToDelete)
    );
    handleCloseDeleteDialog();
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    if (event.target.value) {
      setFilteredOrders(
        orders.filter((order) => order.status === event.target.value)
      );
    } else {
      setFilteredOrders(orders);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return blue[500];
      case "Ordered":
        return yellow[700];
      case "Delivered":
        return green[500];
      case "Cancelled":
        return red[500];
      default:
        return "#000";
    }
  };

  return (
    <Paper
      sx={{
        padding: 3,
        backgroundColor: "white",
        minHeight: "81vh",
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ marginBottom: 2, marginTop: 2 }}
      >
        <Grid item>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#9E4BDC" }}
          >
            Order Management
          </Typography>
        </Grid>
        <Grid item sx={{ minWidth: 250 }}>
          <FormControl fullWidth size="Medium">
            <InputLabel>Filter by status </InputLabel>
            <Select value={statusFilter} onChange={handleStatusFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Ordered">Ordered</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
            {filteredOrders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell sx={{ fontWeight: "bold", color: "#9E4BDC" }}>
                  {order._id}
                </TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>
                  <Typography sx={{ color: getStatusColor(order.status) }}>
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.items?.length || 0} items</TableCell>
                <TableCell>{order.total?.toFixed(2)}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(order)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(order._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>
          Edit Order
          <IconButton onClick={handleCloseEditDialog} sx={{ color: "#9E4BDC" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: "#CE58A9" }}>
              <Typography variant="h6">Order ID: {orderToEdit?._id}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                value={orderToEdit?.customerName || ""}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Items"
                value={
                  orderToEdit?.items?.map((item) => item.name).join(", ") || ""
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={orderToEdit?.size || ""}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Count"
                value={orderToEdit?.count || ""}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Color"
                value={orderToEdit?.color || ""}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Order Date"
                  value={editDate}
                  onChange={(newValue) => setEditDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <MenuItem value="Ordered">Ordered</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEditDialog}
            sx={{ backgroundColor: "#9E4BDC", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            sx={{ backgroundColor: "#CE58A9", color: "white" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ backgroundColor: "#9E4BDC", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteOrder}
            sx={{ backgroundColor: "#CE58A9", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default OrderManagement;
