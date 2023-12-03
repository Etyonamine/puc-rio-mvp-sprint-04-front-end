import React from 'react' /* { useState, useEffect, forwardRef }  */
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    TextField,
    InputLabel,
    MenuItem,
    Select

} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import CleanIcon from '@mui/icons-material/CleaningServices';
import PredicaoIcon from '@mui/icons-material/OnlinePrediction';
/* import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
 */


const CalculoEmbarque = () => {

    const [dataEntrada, setDataEntrada] = React.useState(dayjs(new Date()));
    const [valorEmbarque, setValorEmbarque] = React.useState('0,00');
    const [ufOrigem, setUfOrigem] = React.useState('0');
    const [ufDestino, setUfDestino] = React.useState('0');
    const [codigoSentido, setCodigoSentido] = React.useState('0');
    const [codigoTrecho, setCodigoTrecho] = React.useState('0');
    const [percentualRisco, setPercentualRisco] = React.useState('80');
    const [percentualTaxaBasica, setPercentualTaxaBasica] = React.useState('0,04')
    const [valorPremio, setValorPremio] = React.useState('0,00')

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Rotinas @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    
    //limpar campos
    const LimparCampos = () => {
        setPercentualRisco('80');
        setDataEntrada(dayjs(new Date()));
        setUfOrigem('0');
        setUfDestino('0');
        setCodigoSentido('0');
        setCodigoTrecho('0');
        setValorEmbarque('0,00');
    }

    //origem
    const handleChangeOrigem = (event) =>{
        setUfOrigem(event.target.value);
    }

    //destino
    const handleChangeDestino = (event) =>{
        setUfDestino(event.target.value);
    }

    //sentido
    const handleChangeSentido = (event) =>{
        setCodigoSentido(event.target.value);
    }

    //trecho
    const handleChangeTrecho = (event) =>{
        setCodigoTrecho(event.target.value);
    }

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderização @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>
            <Box
                component='div'
            >
                <h2>Cálculo de Prêmio e Gerenciamento de Risco de Embarque</h2>
            </Box>
            <Box
                component='div'
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
                {/* percentual de ocorrencias de acidentes ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <TextField
                        required
                        id="outlined-helperText"
                        label="% - risco de acidente"
                        labelrequired="*"
                        value={percentualRisco}
                        onChange={(e) => setPercentualRisco(e.target.value)}
                        type='number'
                        inputProps={{
                            maxLength: 3,
                            fontSize: 10,
                            style: { textAlign: 'right' }
                        }}
                    />
                </FormControl>
                &nbsp;
                {/* percentual de taxa basica de percurso ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <TextField
                        required
                        id="outlined-helperText"
                        label="% - taxa básica"
                        labelrequired="*"
                        value={percentualTaxaBasica}
                        disabled='true'
                        inputProps={{
                            maxLength: 3,
                            fontSize: 10,
                            style: { textAlign: 'right' }
                        }}
                    />
                </FormControl>
            </Box>
            <br />
            <Box
                component='div'
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >

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

                {/* UF - Origem ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <InputLabel id="lbl_uf_origem">Origem</InputLabel>
                    <Select
                        labelId="lbl_uf_origem"
                        id="cbo_uf_origem"
                        value={ufOrigem}
                        label="Origem"
                        onChange={(e) => handleChangeOrigem(e)}
                        inputProps={{
                            style: { fontSize: 14, textAlign: 'left' },

                        }}
                    >
                        <MenuItem value={0}>Selecione</MenuItem>
                        <MenuItem value={24}>SP</MenuItem>
                        <MenuItem value={20}>RJ</MenuItem>
                    </Select>
                </FormControl>
                &nbsp;

                {/* UF - Destino ***************************************************** */}
                <FormControl sx={{ width: 150, textAlign: 'center' }}>
                    <InputLabel id="lbl_uf_destino">Destino</InputLabel>
                    <Select
                        labelId="lbl_uf_destino"
                        id="cbo_uf_destino"
                        value={ufDestino}
                        label="Destino"
                    onChange={(e) => handleChangeDestino(e)}
                    >
                        <MenuItem value={0}>Selecione</MenuItem>
                        <MenuItem value={24}>SP</MenuItem>
                        <MenuItem value={20}>RJ</MenuItem>
                    </Select>
                </FormControl>
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
                        label="Valor-Embarque"
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
                        label="Valor de prêmio"                         
                        value={valorPremio}
                        disabled = 'true'                        
                        inputProps={{
                            maxLength: 15,
                            fontSize: 10,
                            style: { textAlign: 'right' }
                        }}
                    />
                </FormControl>
            </Box>
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
                    onClick={LimparCampos}    
                    color = 'secondary'
                >
                    Predição
                </Button>
            </Box>
        </div>
    )
}
export default CalculoEmbarque;