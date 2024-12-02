import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import Dashboard from "./pages/dashBoard";
import ProjectManagement from "./pages/ProjectManagement";
import Category from "./pages/Category";
import OrderManagement from "./pages/OrderManagement";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddCategory from "./pages/AddCategory";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Update the login state to true after a successful login
  };

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TopBar />
        <div style={{ display: "flex" }}>
          {isLoggedIn && <Sidebar />}
          <div
            style={{
              flex: 1,
              paddingLeft: isLoggedIn ? "25px" : "0px", // Adjust padding if Sidebar is hidden
              backgroundColor: "#F3F6F6",
              minHeight: "92vh",
              overflow: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              {isLoggedIn && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/project-management"
                    element={<ProjectManagement />}
                  />
                  <Route path="/category" element={<Category />} />
                  <Route
                    path="/order-management"
                    element={<OrderManagement />}
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/edit-product/:id" element={<EditProduct />} />
                  <Route path="/add-category" element={<AddCategory />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;