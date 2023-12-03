import React from 'react';
import Container from '@mui/material/Container';
import TituloPagina from '../../components/TituloPrincipal'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import CalculoEmbarque from '../../components/Averbacao/CalculoEmbarque';
import Box from '@mui/material/Box';

const Averbacao = () => {
    return (
         
        <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <TituloPagina titulo = "Averbação - Análise do Embarque"  />    
          <Typography component="div" style={{  height: '300px' }}>
            <Box
                sx={{marginTop:'10px'}}
            >                
                <CalculoEmbarque />
            </Box>
            
          </Typography>                    
        </Container>
      </React.Fragment>
    );
};

export default Averbacao;