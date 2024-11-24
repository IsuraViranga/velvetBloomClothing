import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Drawer } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 270,
          backgroundColor: '#BE78F0', 
          color: 'white',
          border: 'none',
          top: 0,
          height: '100vh',
          paddingLeft: 3, 
          borderTopRightRadius: 16, 
          borderBottomRightRadius: 16, 
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#9E4BDC', 
          paddingRight: 2 
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          <ListItem sx={{ marginBottom: 2 }}>
            <ListItemText
              primary="Velvet Bloom"
              sx={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: '34px', 
                textDecoration: 'none', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px', 
                textAlign:'center',
                backgroundColor:'white',
                padding:2,
                borderTopLeftRadius: 25, 
                borderBottomRightRadius: 25,
              }}
            />
          </ListItem>

          {/* List items with icons */}
          {[ 
            { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { label: 'Product Management', icon: <AssignmentIcon />, path: '/project-management' },
            { label: 'Category Management', icon: <CategoryIcon />, path: '/category' },
            { label: 'Order Management', icon: <ShoppingCartIcon />, path: '/order-management' },
          ].map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => handleTabClick(item.label)}
              sx={{
                color: 'white',
                mb: 2,
                backgroundColor: activeTab === item.label ? '#BE78F0' : '#9E4BDC', 
                '&:hover': { backgroundColor: '#d1a3ff' }, 
                borderTopRightRadius: 14, 
                borderBottomRightRadius: 14, 
                gap: 2,
              }}
            >
              {item.icon}
              <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', marginLeft: 2 }}>
                <ListItemText primary={item.label} />
              </Link>
            </ListItem>
          ))}
        </List>

        {/* Bottom items for Settings and Log Out */}
        <List>
          {[ 
            { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
            { label: 'Log Out', icon: <ExitToAppIcon />, path: '/logout' },
          ].map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => handleTabClick(item.label)}
              sx={{
                color: 'white',
                mb: 2,
                backgroundColor: activeTab === item.label ? '#BE78F0' : '#9E4BDC', 
                '&:hover': { backgroundColor: '#d1a3ff' }, 
                borderTopRightRadius: 14, 
                borderBottomRightRadius: 14, 
                gap: 2,
              }}
            >
              {item.icon}
              <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', marginLeft: 2 }}>
                <ListItemText primary={item.label} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
