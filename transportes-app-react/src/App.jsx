
import Container from '@mui/material/Container';
import NavBar from './components/Navbar';
import Averbacao from './pages/Averbacao/averbacao';
import Copyright from './components/Copyrigth';
import Box from '@mui/material/Box';


 function App() { 

  return (  
    <div>
      <Container fixed>
        <Box 
          component='div'
          sx={{ my: 4 }}
        >
          <NavBar />
          <Averbacao />
          
        </Box>
  
        <Box
          component='div'
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
        >
           
        </Box>
      </Container>
     
    </div>
  )
}

export default App
