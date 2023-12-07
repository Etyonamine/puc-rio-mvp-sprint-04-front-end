import React, { useEffect } from 'react'
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    Paper,
    Table,
    TableBody,
    TextField,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    InputLabel,
    MenuItem,
    Select,
    styled
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import CleanIcon from '@mui/icons-material/CleaningServices';
import PredicaoIcon from '@mui/icons-material/OnlinePrediction';


const CalculoEmbarque = () => {

    const [dataEntrada, setDataEntrada] = React.useState(dayjs(new Date()));
    const [valorEmbarque, setValorEmbarque] = React.useState('0,00');    
    const [codigoSentido, setCodigoSentido] = React.useState('0');
    const [codigoTrecho, setCodigoTrecho] = React.useState('0');
    const [percentualRisco, setPercentualRisco] = React.useState('80');    
    const [percentualTaxaBasica] = React.useState('0,04')
    const [valorPremio, setValorPremio] = React.useState('0,00')
    const [acidentesRiscosEncontrados, setListaAcidentesRiscos] = React.useState([{ "id": "0", "acidente": '', "risco": '', "total": '' }])
    const [urlBase] = React.useState(`${import.meta.env.VITE_URL_API_PREDICAO}`);
    const [descricaoRisco, setDescricaoRisco] = React.useState('');    
    const [valorPremioAgravado,setValorPremioAgravado] = React.useState(0);
    const [valorTaxaEncontrado, setValorTaxaEncontrado] = React.useState(0);
    const [listaRiscos,setListaRiscos] = React.useState([]);

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Rotinas @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
 
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: 'plum',//theme.palette.common.black
            color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    useEffect (()=>{
        getRiscos();
    },[]);

    useEffect(() => {
        if (valorEmbarque != '0,00' || valorEmbarque != '') {
            calcular_premio_viagem();
        }
    },[valorEmbarque]);

    useEffect(()=>{
        if (acidentesRiscosEncontrados.length ===0){
            calcula_valor_premio_agravo(0);
            setDescricaoRisco('');
            alert('A predição não encontrou riscos de acidentes para o agravo do embarque!')
        }
        

    },[acidentesRiscosEncontrados])

    //limpar campos
    const LimparCampos = () => {
        setPercentualRisco('80');
        setDataEntrada(dayjs(new Date()));        
        setCodigoSentido('0');
        setCodigoTrecho('0');
        setValorEmbarque('0,00');        
        setValorTaxaEncontrado(0);
        
        identifica_classe_risco(0);
        setListaAcidentesRiscos([]);

    }
    // calcula o valor da taxa de agravo
    const valorTaxaAgravo = (codigo) => {       
        return listaRiscos.find(x=>x.id_risco == codigo).percentual_taxa;         
    }
    //calcula o valor do premio agravo
    const calcula_valor_premio_agravo =(percentual)=>{
        if (percentual === 0){            
            setDescricaoRisco('');            
            setValorPremioAgravado(0);    
            return;
        }
        let valorAgravoCalculado = parseFloat(valorPremio.replace(',','.')) * (parseFloat(percentual.replace(',','.'))/100);
        let valorTotal =parseFloat(valorPremio.replace(',', '.')) + valorAgravoCalculado;        
        setValorPremioAgravado(valorTotal);
    }
    // Predição
    const setPredicao = () => {

        try {

            //valida se as informações estao preenchidas
            if (dataEntrada == undefined) {
                alert('Por favor, informe a data de embarque!')
                return;
            }
            
            if (codigoSentido === '0') {
                alert('Por favor, informe o sentido da viagem!')
                return;
            }
            if (codigoTrecho === '0') {
                alert('Por favor, informe o trecho da viagem!')
                return;
            }
            if (valorEmbarque == '0,00' || valorEmbarque === undefined) {
                alert('Por favor, informe o valor de embarque!')
                return;
            }

            let url_predicao = urlBase + '/predicao';
            const data = new FormData();
            data.append("dia", getDiaSelecionado());
            data.append("mes", getMesSelecionado());
            data.append("id_sentido", codigoSentido);
            data.append("id_trecho", codigoTrecho);
            data.append("percentual_risco", (percentualRisco / 100));

            fetch(url_predicao,
                {
                    method: 'POST',
                    body: data
                })
                .then(response => response.json())
                .then(responseData => {
                    let codigo = responseData.id_risco;
                    let percentualTaxaAgravo = valorTaxaAgravo(codigo);
                    calcula_valor_premio_agravo(percentualTaxaAgravo);                    
                    setDescricaoRisco(identifica_classe_risco(codigo));                    
                    getLista();


                })
                .catch(error => {
                    console.error(error);
                    return Promise.reject(error);
                });

        } catch (error) {
            if (error.message === "Failed to fetch") {
                // get error message from body or default to response status                    
                alert('A comunicação com os serviços de predição de Acidentes está com problemas!');
                return Promise.reject(error);
            }

        }

    }
    // lista de acidentes
    const getLista = () => {
        let dia = getDiaSelecionado();
        let mes = getMesSelecionado();
        if (codigoTrecho === 0 || codigoSentido === 0) {
            return
        }
        let url_consulta = urlBase + `/acidentes_riscos?dia=${dia}&mes=${mes}&id_trecho=${codigoTrecho}&id_sentido=${codigoSentido}`;

        fetch(url_consulta)
            .then(response => response.json())
            .then(responseData => {                
                setListaAcidentesRiscos(responseData.lista);                              
            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com o serviço de consulta de Modelo de acidentes está com problemas!');
                }
                setListaAcidentesRiscos([]);
                console.log(error);
            });
    }
    // lista de risco
    const getRiscos = ()=>{
        let url_risco = urlBase + '/riscos';

        fetch(url_risco)
        .then(response => response.json())
        .then(responseData => {
            if (responseData.lista !== undefined) {
                setListaRiscos(responseData.lista);
            }
        })
        .catch(error => {
            if (error.message === "Failed to fetch") {
                // get error message from body or default to response status                    
                alert('A comunicação com o serviço de consulta de Modelo de acidentes está com problemas!');
            }
            setListaAcidentesRiscos([]);
            console.log(error);
        });
    }
    // identifica a classe de risco conforme codigo de risco
    const identifica_classe_risco = (codigo) => {
        switch (codigo) {
            case 1:
                return 'Baixo';
            case 2:
                return 'Médio';
            case 3:
                return 'Alto';
            default:
                return 'Não identificado';
        }
    }
    //recupera o mes informado
    const getMesSelecionado = () => {
        return new Date(dataEntrada.toISOString()).getMonth();
    }
    //recupera o dia informado
    const getDiaSelecionado = () => {

        return new Date(dataEntrada.toISOString()).getDate();
    }    
    //sentido
    const handleChangeSentido = (event) => {
        setCodigoSentido(event.target.value);
    }
    //trecho
    const handleChangeTrecho = (event) => {
        setCodigoTrecho(event.target.value);
    }
    //calcular o premio
    const calcular_premio_viagem = () => {

        let percentual_recalculado = parseFloat(percentualTaxaBasica.replace(',', '.'));

        let valorCalculado = parseFloat(percentual_recalculado) * parseFloat(valorEmbarque.replace(',', '.'));

        setValorPremio(valorCalculado.toFixed(2).replace('.', ','))
    } 

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderização @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>
            <Box
                component='div'
               
            >                
                <Typography variant="h5" gutterBottom>
                    <b>Concessionária - Nova Dutra - Predição de risco de acidente</b>
                </Typography>
            </Box>          
            <Box
                component='div'
            >                
                <Typography variant="h6" gutterBottom>
                    Cálculo de Prêmio e Gerenciamento de Risco de Embarque
                </Typography>
            </Box>          
            <Divider />
            <br />
            <Box
                component='div'
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
                {/* percentual de ocorrencias de acidentes ***************************************************** */}
                <FormControl sx={{ width: 200, textAlign: 'center' }}>
                    <TextField
                        required
                        id="outlined-helperText"
                        label="% - risco maior frequência"
                        labelrequired="*"
                        value={percentualRisco}
                        onChange={(e) => setPercentualRisco(e.target.value)}
                        type='number'
                        inputProps={{
                            maxLength: 3,
                            fontSize: 10,
                            style: { textAlign: 'right' },
                            disabled: true
                        }}
                    />
                </FormControl>
                &nbsp;
                {/* percentual de taxa basica de percurso ***************************************************** */}
                <FormControl sx={{ width: 120, textAlign: 'center' }}>
                    <TextField
                        required
                        id="outlined-helperText"
                        label="% - taxa básica"
                        labelrequired="*"
                        value={percentualTaxaBasica}
                        inputProps={{
                            maxLength: 3,
                            fontSize: 10,
                            style: { textAlign: 'right' },
                            disabled: true
                        }}
                    />
                </FormControl>           
                &nbsp;
                {/* Data ***************************************************** */}
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"

                >
                    <FormControl
                        sx={{ width: 150, textAlign: 'center' }}
                    >
                        <DateTimeField
                            id="dataEmbarque"
                            label="Data-Embarque"
                            value={dayjs(dataEntrada)}
                            onChange={(newValue) => setDataEntrada(newValue)}
                            inputProps={{
                                style: { fontSize: 14, textAlign: 'left' },

                            }}
                        />
                    </FormControl>
                </LocalizationProvider>
                &nbsp;
                      
                {/* sentido da rodovia ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <InputLabel id="lbl_sentido">Sentido</InputLabel>
                    <Select
                        labelId="lbl_sentido"
                        id="cbo_sentido"
                        value={codigoSentido}
                        label="Destino"
                        onChange={(e) => handleChangeSentido(e)}
                    >
                        <MenuItem value={0}>Selecione</MenuItem>
                        <MenuItem value={1}>Crescente</MenuItem>
                        <MenuItem value={2}>Decrescente</MenuItem>
                        <MenuItem value={3}>Pista Norte</MenuItem>
                        <MenuItem value={4}>Pista Sul</MenuItem>
                    </Select>
                </FormControl>
                &nbsp;

                {/* trecho a percorrer da rodovia ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <InputLabel id="lbl_trecho">Trecho</InputLabel>
                    <Select
                        labelId="lbl_trecho"
                        id="cbo_trecho"
                        value={codigoTrecho}
                        label="Trecho"
                        onChange={(e) => handleChangeTrecho(e)}
                    >
                        <MenuItem value={0}>Selecione</MenuItem>
                        <MenuItem value={1}>BR-116/SP</MenuItem>
                        <MenuItem value={2}>BR-116/RJ</MenuItem>
                    </Select>
                </FormControl>
                &nbsp;
                {/* valor de embarque ***************************************************** */}
                <FormControl
                    sx={{ width: 150, textAlign: 'center' }}
                >
                    <TextField
                        required
                        id="outlined-helperText"
                        label="Valor(R$)-Embarque"
                        labelrequired="*"
                        value={valorEmbarque}
                        onChange={(e) => setValorEmbarque(e.target.value)}
                        inputProps={{
                            maxLength: 15,
                            fontSize: 10,
                            style: { textAlign: 'right' },
                            step: "0.01"
                        }}
                    />
                </FormControl>
                &nbsp;
                {/* valor de prêmio calculado ***************************************************** */}
                <FormControl
                    sx={{ width: 150, textAlign: 'center' }}
                >
                    <TextField
                        required
                        id="outlined-helperText"
                        label="Valor(R$)-prêmio"
                        value={valorPremio}
                        inputProps={{
                            maxLength: 15,
                            fontSize: 10,
                            style: { textAlign: 'right' },
                            disabled: true

                        }}
                    />
                </FormControl>
            </Box>
            <br />
            <Divider />
            <br />
            
            {/* ********************** Botões  ******************************** */}
            <Box
                component='div'
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >

                <Button
                    variant="contained"
                    endIcon={<CleanIcon />}
                    color="primary"
                    onClick={LimparCampos}
                >
                    Limpar
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    endIcon={<PredicaoIcon />}
                    onClick={setPredicao}
                    color='secondary'
                >
                    Predição
                </Button>
            </Box>
            <br />
            <Divider />
            <Box
                component='div'
                sx={{  justifyContent: 'flex-start' }}
            >
                <Typography variant="h6" gutterBottom>
                    Avaliação - Agravo na cobrança do prêmio
                </Typography>


                <Grid container spacing={1}>
                    <Grid item xs={6} sx={{display: 'flex', justifyContent:'flex-start' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell colSpan='2'>                                            
                                            Tabela de percentual de agravo                                            
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>Risco</StyledTableCell>
                                        <StyledTableCell align="center">Taxa-agravo (%)</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {listaRiscos.map((row) => (
                                        <StyledTableRow
                                            key={row.id_risco}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <StyledTableCell component="th" scope="row">
                                                {row.descricao}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{ row.percentual_taxa}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>
                    <Grid item xs={6}sx={{display: 'flex', justifyContent:'flex-end' }}>
                        <TableContainer component={Paper} >
                            <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell   sx={{display:'flex' , justifyContent:'center'}}>Resultado Predição</StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell component="th" scope="row" sx={{display:'flex' , justifyContent:'center'}}>
                                            <Typography component='div'>
                                                O risco de acidente foi considerado
                                            </Typography>                                            
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>

                                   
                                    <StyledTableRow>
                                        <StyledTableCell component="th" scope="row" sx={{display:'flex' , justifyContent:'center'}}>
                                            <Typography component = 'div' variant="h7" gutterBottom>
                                                    <b>{descricaoRisco}</b>
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="center" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            Prêmio com agravo
                                        </StyledTableCell>                                        
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell  align="center">                                        
                                            <div disabled = {valorTaxaEncontrado == 0}>
                                                <b>{valorPremioAgravado.toFixed(2).replace('.',',')}</b>                     
                                            </div>                                            
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
 
            </Box>
            <br />
            <Divider />
            {/* TABELA  ********************************************************************************** */}
            <Box
                component="div"
            >
                <Typography variant="h6" gutterBottom>
                    Lista de ocorrências de acidentes - 2010 à 2023
                </Typography>
                <Divider />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="lista">
                        <TableHead sx={{ height: 40 }}>
                            <TableRow>
                                <StyledTableCell align="center">Id</StyledTableCell>
                                <StyledTableCell align="center">Acidente</StyledTableCell>
                                <StyledTableCell align="center">Quantidade</StyledTableCell>
                                <StyledTableCell align="center">Risco</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >
                            {
                                acidentesRiscosEncontrados.map((row) => (
                                    <StyledTableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 40 }}
                                    >
                                        <StyledTableCell align='center'
                                            component="th"
                                            scope="row"
                                            divider={<Divider orientation="vertical" flexItem />}
                                        >
                                            {row.id}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.acidente}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.total}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.risco}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    )
}
export default CalculoEmbarque;