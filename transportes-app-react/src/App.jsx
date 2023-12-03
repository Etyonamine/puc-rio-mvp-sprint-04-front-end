
import Container from '@mui/material/Container';
import NavBar from './components/Navbar';
import Averbacao from './pages/Averbacao/averbacao';
import Copyright from './components/Copyrigth';
import Box from '@mui/material/Box';


 function App() { 

  return (  
    <div>
      <Container fixed>
        <Box sx={{ my: 4 }}>
          <NavBar />
          <Averbacao />
          
        </Box>
  
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <Copyright />   
        </Box>
      </Container>
     
    </div>
  )
}

export default App
