import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios"; // Axios for API calls

// Styled components for cards and table cells
const StyledCard = styled(Card)(({ index }) => ({
  backgroundColor: index === 0 ? "#9E4BDC" : "#F7F5FD",
  color: index === 0 ? "white" : "#9E4BDC",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
  },
}));

const StyledTableCellHeader = styled(TableCell)({
  borderBottom: "2px solid #E0E0E0",
  borderRight: "1px solid #E0E0E0",
  padding: "12px",
  fontWeight: "bold",
});

const StyledTableCellBody = styled(TableCell)({
  borderBottom: "1px solid #E0E0E0",
  borderRight: "1px solid #E0E0E0",
  padding: "12px",
  fontWeight: "normal",
  color: "#666",
});

const Dashboard = () => {
  // State management
  const [stats, setStats] = useState(null); // For inventory stats
  const [lowStockProducts, setLowStockProducts] = useState([]); // For low stock products
  const [recentOrders, setRecentOrders] = useState([]); // For recent orders
  const [orderCount, setOrderCount] = useState(0); // Total order count

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory stats
        const statsResponse = await axios.get(
          "http://localhost:8080/api/inventories/stats"
        );
        setStats(statsResponse.data);

        // Fetch low stock products
        const lowStockResponse = await axios.get(
          "http://localhost:8080/products/low-stock"
        );
        setLowStockProducts(lowStockResponse.data);

        // Fetch recent orders
        const recentOrdersResponse = await axios.get(
          "http://localhost:8080/orders/recent"
        );
        setRecentOrders(recentOrdersResponse.data);

        // Fetch total order count
        const orderCountResponse = await axios.get(
          "http://localhost:8080/orders/count"
        );
        setOrderCount(orderCountResponse.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Paper
        sx={{
          padding: 3,
          backgroundColor: "white",
          minHeight: "81vh",
          margin: 2,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#9E4BDC", fontWeight: "bold", marginBottom: 4 }}
        >
          Dashboard
        </Typography>

        {/* Dashboard Statistics Cards */}
        <Grid container spacing={4}>
          {[
            { title: "Total Sales", value: stats?.totalSales || "$0" },
            { title: "New Orders", value: stats?.newOrders || 0 },
            { title: "Pending Orders", value: stats?.pendingOrders || 0 },
            { title: "Low Products", value: lowStockProducts.length },
          ].map((item, index) => (
            <Grid item xs={12} md={3} key={index}>
              <StyledCard index={index}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h4" sx={{ marginTop: 2 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Tables for Low Stock Products and Recent Orders */}
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {/* Low Stock Products Table */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#9E4BDC" }}
              >
                Low Stock Products
              </Typography>
              <Table sx={{ marginTop: 2, border: "1px solid #E0E0E0" }}>
                <TableHead>
                  <TableRow>
                    {["Product ID", "Product Name", "Stock"].map(
                      (heading, index) => (
                        <StyledTableCellHeader key={index}>
                          {heading}
                        </StyledTableCellHeader>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.map((product, index) => (
                    <TableRow key={index} hover>
                      <StyledTableCellBody>{product.id}</StyledTableCellBody>
                      <StyledTableCellBody>{product.name}</StyledTableCellBody>
                      <StyledTableCellBody>{product.stock}</StyledTableCellBody>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>

          {/* Recent Orders Table */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#9E4BDC" }}
              >
                Recent Orders
              </Typography>
              <Table sx={{ marginTop: 2, border: "1px solid #E0E0E0" }}>
                <TableHead>
                  <TableRow>
                    {["OrderID", "Customer", "Date", "Status", "Total"].map(
                      (heading, index) => (
                        <StyledTableCellHeader key={index}>
                          {heading}
                        </StyledTableCellHeader>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order, index) => (
                    <TableRow key={index} hover>
                      <StyledTableCellBody>{order.id}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {order.customer}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{order.date}</StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{
                          color:
                            order.status === "Completed"
                              ? "#00BFA6"
                              : order.status === "Pending"
                              ? "#FF9800"
                              : "#F44336",
                          fontWeight: "bold",
                        }}
                      >
                        {order.status}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{order.total}</StyledTableCellBody>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Dashboard;