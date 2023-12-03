import React from 'react' /* { useState, useEffect, forwardRef }  */
import {
    Box,
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
/* import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
 */


const CadastroEmbarque = () => {

    const [dataEntrada, setDataEntrada] = React.useState(dayjs(new Date()));
    const [valorEmbarque, setValorEmbarque] = React.useState('')

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderização @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>
            <Box
                component='div'
            >
                <h2>Cadastro de Averbação</h2>
            </Box>
            <Box
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
            > <FormControl sx={{ minWidth: 300 }} noValidate
                autoComplete="off">

                    <InputLabel id="lblSelectMarca">Segurado</InputLabel>
                    <Select
                        displayEmpty
                        id="marcas_select"
                        //value={codigoMarca}
                        label="Segurado"
                        //onChange={handleChange}

                    >
                       {/*  <MenuItem value={""}>Selecione uma marca</MenuItem>
                        {
                            marcasEncontradas.map((row) => (
                                <MenuItem value={row.codigo}>{row.nome}</MenuItem>
                            ))
                        } */}
                    </Select>

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

                {/* Placa ***************************************************** */}
                <TextField
                    required
                    id="outlined-helperText"
                    label="Valor"
                    labelrequired="*"
                    value={valorEmbarque}
                    onChange={(e) => setValorEmbarque(e.target.value)}
                    inputProps={{
                        maxLength: 7
                    }}
                    helperText="Digite o valor de embarque com virgula sem o milhar"
                />
            </Box>

        </div>
    )
}
export default CadastroEmbarque;