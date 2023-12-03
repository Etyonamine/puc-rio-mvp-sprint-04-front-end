import { Typography, Box } from "@mui/material";
const TituloPrincipal = () => {
    return (
            <Box 
                component = "div"
                style = {{backgroundColor:"#1976d2",color: "white"}}
            >
                <Typography
                    variant="h6"
                    noWrap
                    component="a"            
                     
                >
                    SST - Sistema de Seguros de Transportes
                </Typography>
            </Box>     
            
        
        
    );
};

export default TituloPrincipal;