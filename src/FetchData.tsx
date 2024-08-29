import { useEffect, useState } from 'react';
import { RelatorioData } from './interface/data';
import { Box, Grid2, Typography, TextField } from '@mui/material';
import { addMonths, differenceInMonths, format, parseISO } from 'date-fns';
import BarAnimated from './BarAnimated';

const FetchData = () => {
    const [data, setData] = useState<RelatorioData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(BASE_URL)
                const formated: RelatorioData[] = await response.json()
                setData(formated)
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Renderiza de acordo com o estado da requisição
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    

    // Função para processar os dados e formatar as datas
    const processData = (data: RelatorioData[]) => {
        return data.map(item => ({
            ...item,
            clc_datainicio: parseISO(item.clc_datainicio),
            clc_datafim: parseISO(item.clc_datafim)
        }));
    };
    
    // Função para calcular a posição e o tamanho da barra
    const calculateBarPosition = (startDate: Date, endDate: Date, minDate: Date, maxDate: Date) => {
        const totalDuration = maxDate.getTime() - minDate.getTime();
        const startOffset = ((startDate.getTime() - minDate.getTime()) / totalDuration) * 100;
        const endOffset = ((endDate.getTime() - minDate.getTime()) / totalDuration) * 100;
        const width = endOffset - startOffset;

        return { startOffset, width };
    };

    const processedData = processData(data ?? []);
    const minDate = new Date(Math.min(...processedData.map(d => d.clc_datainicio.getTime())));
    const maxDate = new Date(Math.max(...processedData.map(d => d.clc_datafim.getTime())));


    const months = differenceInMonths(maxDate, minDate) + 1;
    const monthLabels = Array.from({ length: months }, (_, i) =>
        i % 9 === 0 || i === months - 1 ? format(addMonths(minDate, i), 'MMM/yy') : ''
    );

    // Filtragem dos dados com base no termo de pesquisa
    const filteredData = processedData.filter(item =>
        item.cli_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '99vw', height: '99vh' }}>
            {/* Campo de pesquisa */}
            <Box sx={{ paddingX: 5, paddingY: 3 }}>
                <TextField
                    label="Pesquisar por nome"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <Grid2 container spacing={2} sx={{ padding: 4, backgroundColor: '#f4edff', maxWidth: '100%', overflowX: 'auto' }}>
                {/* A1: Espaço em branco */}
                <Grid2 size={2}>
                    <Typography variant="body1" sx={{ color: '#3b1a5a' }}>{'Relatório'}</Typography>
                </Grid2>

                {/* A2: Todos os meses */}
                <Grid2 size={10}>
                    <Box sx={{ position: 'relative', display: 'flex', marginBottom: 2 }}>
                        {monthLabels.map((label, index) => (
                            <Box key={index} sx={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                                {label && (
                                    <>
                                        <Typography variant="caption" sx={{ color: '#3b1a5a' }}>{label}</Typography>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '20px',
                                                left: '50%',
                                                bottom: '0px',
                                                width: '1px',
                                                backgroundColor: '#ccc',
                                            }}
                                        />
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Grid2>

                {/* B1: Nomes dos clientes */}
                <Grid2 size={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredData.map((item) => (
                            <Box key={item.clc_cli_codig} sx={{ height: 70, display: 'flex', alignItems: 'center', border: '1px solid #3b1a5a0f' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#3b1a5a',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        textAlign: 'right',
                                        padding: '0 15px'
                                    }}
                                >
                                    {item.cli_nome}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid2>

                {/* B2: Barras */}
                <Grid2 size={10}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredData.map((item) => {
                            const { startOffset, width } = calculateBarPosition(
                                item.clc_datainicio,
                                item.clc_datafim,
                                minDate,
                                maxDate
                            );

                            return (
                                <Box key={item.clc_cli_codig} sx={{ height: 70, position: 'relative', border: '1px solid #3b1a5a0f' }}>
                                    
                                        <BarAnimated width={width} startOffset={startOffset} item={item} />
                                    
                                </Box>
                            );
                        })}
                    </Box>
                </Grid2>

            </Grid2>
        </Box>
    );
};

export default FetchData;
