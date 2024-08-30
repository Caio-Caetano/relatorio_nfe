import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

function gerarListaAno(): string[] {
    const primeiroAno = 2015;
    const anoAtual = new Date().getFullYear();

    const listaAno: string[] = [];

    for (let ano = primeiroAno; ano <= anoAtual; ano++) {
        listaAno.push(ano.toString());
    }

    return listaAno;
}

function SelectAno({ onChangeAno }: { onChangeAno: (ano: string) => void }) {
    const [ano, setAno] = useState('');

    const listaAno = gerarListaAno();

    const handleChange = (event: SelectChangeEvent) => {
        const anoSelecionado = event.target.value as string;
        setAno(anoSelecionado);
        onChangeAno(anoSelecionado); // Passa o ano apra o componente Pai
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ano</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={ano}
                    label="Ano"
                    onChange={handleChange}
                >
                    {
                        listaAno.map((ano) => (
                            <MenuItem key={ano} value={ano}>
                                {ano}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
}

export default SelectAno;