import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Grid,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import CasinoIcon from '@mui/icons-material/Casino';
import PetsIcon from '@mui/icons-material/Pets';
import io from 'socket.io-client';

import CharacterSheet from './components/master/CharacterSheet';
import DiceRoller from './components/player/DiceRoller';
import MapGenerator from './components/master/MapGenerator';
import Chat from './components/shared/Chat';
import PartyManager from './components/master/PartyManager';
import Bestiary from './components/master/Bestiary';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7b1fa2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

interface User {
  id: string;
  name: string;
  role: 'master' | 'player';
}

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user] = useState<User>({
    id: '1',
    name: 'Usuário Teste',
    role: 'master'
  });
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: ['master', 'player']
    },
    {
      text: 'Personagens',
      icon: <PersonIcon />,
      path: '/characters',
      roles: ['master', 'player']
    },
    {
      text: 'Dados',
      icon: <CasinoIcon />,
      path: '/dice',
      roles: ['master', 'player']
    },
    {
      text: 'Mapas',
      icon: <MapIcon />,
      path: '/maps',
      roles: ['master']
    },
    {
      text: 'Grupo',
      icon: <GroupIcon />,
      path: '/party',
      roles: ['master']
    },
    {
      text: 'Bestiário',
      icon: <PetsIcon />,
      path: '/bestiary',
      roles: ['master']
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/chat',
      roles: ['master', 'player']
    }
  ];

  const DrawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                RPG Manager
              </Typography>
              <Button color="inherit">
                {user.name} ({user.role})
              </Button>
            </Toolbar>
          </AppBar>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
          >
            {DrawerContent}
          </Drawer>

          <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {user.role === 'master' ? (
                      <PartyManager />
                    ) : (
                      <CharacterSheet />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <DiceRoller socket={socket} />
                  </Grid>
                  <Grid item xs={12}>
                    <Chat socket={socket} username={user.name} roomId="main" isMaster={user.role === 'master'} />
                  </Grid>
                </Grid>
              } />

              <Route 
                path="/characters" 
                element={
                  user.role === 'master' ? (
                    <PartyManager />
                  ) : (
                    <CharacterSheet />
                  )
                } 
              />
              <Route path="/dice" element={<DiceRoller socket={socket} />} />
              <Route
                path="/maps"
                element={
                  user.role === 'master' ?
                    <MapGenerator /> :
                    <Navigate to="/" replace />
                }
              />
              <Route
                path="/party"
                element={
                  user.role === 'master' ?
                    <PartyManager /> :
                    <Navigate to="/" replace />
                }
              />
              <Route
                path="/bestiary"
                element={
                  user.role === 'master' ?
                    <Bestiary /> :
                    <Navigate to="/" replace />
                }
              />
              <Route
                path="/chat"
                element={
                  <Chat socket={socket} username={user.name} roomId="main" isMaster={user.role === 'master'} />
                }
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
