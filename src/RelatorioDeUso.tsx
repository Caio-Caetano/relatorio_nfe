import { useEffect, useMemo, useState } from 'react';
import { RelatorioData } from './interface/data';
import { Box, Grid2, Typography, TextField, TooltipProps, Tooltip, tooltipClasses } from '@mui/material';
import { addMonths, differenceInMonths, format, parseISO, startOfYear } from 'date-fns';
import BarAnimated from './BarAnimated';
import ModalCliente from './components/ModalCliente';
import styled from '@emotion/styled';
import { ptBR } from 'date-fns/locale';
import './utils/stringExtension.ts';
import SelectAno from './components/SelectAno.tsx';
import LoadingComponent from './components/LoadingComponent.tsx';
import ErrorComponent from './components/ErrorComponent.tsx';

const RelatorioDeUso = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Criação das váriaves
    const [data, setData] = useState<RelatorioData[] | null>(null); // Retorno dos dados
    const [loading, setLoading] = useState(true); // Carregando...
    const [error, setError] = useState<string | null>(null); // Erro
    const [searchTerm, setSearchTerm] = useState<string>(''); // Termo digitado na barra de pesquisa
    const [ano, setAno] = useState(''); // Termo selecionado no SELECT do ano
    
    const [isModalOpen, setIsModalOpen] = useState(false); // Controle do Modal
    const [content, setContent] = useState(''); // Controle do conteúdo do Modal

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('/api/rel_periodouso.php')
                const response = await fetch(`${BASE_URL}&ano=${ano}`)
                const formated: RelatorioData[] = await response.json()
                setData(formated)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        };
        
        fetchData();
    }, [ano]);

    // Função para processar os dados e formatar as datas
    const processData = (data: RelatorioData[]) => {
        return data.map(item => ({
            ...item,
            clc_datainicio: parseISO(item.clc_datainicio),
            clc_datafim: parseISO(item.clc_datafim)
        }));
    };

    const processedData = processData(data ?? []);

    // Filtragem dos dados com base no termo de pesquisa
    const filteredData = useMemo(() => {
        return processedData.filter(item => {
            const itemStartYear = new Date(item.clc_datainicio).getFullYear();
            const itemEndYear = new Date(item.clc_datafim).getFullYear();

            const selectedYear = parseInt(ano, 10);

            // Verifica se o intervalo do cliente intercepta com o ano selecionado
            const isWithinYear =
                !ano ||
                (itemStartYear <= selectedYear && itemEndYear >= selectedYear);

            return item.cli_nome.toLowerCase().includes(searchTerm.toLowerCase()) && isWithinYear;
        });
    }, [searchTerm, ano, processedData]);

    const filteredDates = filteredData.map(d => ({
        start: new Date(d.clc_datainicio),
        end: new Date(d.clc_datafim),
    }));

    const minDate = useMemo(() => {
        return ano ? startOfYear(new Date(parseInt(ano), 0, 1)) : new Date(Math.min(...filteredDates.map(d => d.start.getTime())));
    }, [filteredDates, ano]);

    const maxDate = useMemo(() => {
        return ano
            ? new Date(Math.max(...filteredDates.map(d => d.end.getTime())))
            : new Date(Math.max(...filteredDates.map(d => d.end.getTime())));
    }, [filteredDates, ano]);

    const months = useMemo(() => differenceInMonths(maxDate, minDate) + 1, [maxDate, minDate]);

    const monthLabels = useMemo(() => {
        let interval = 1;
        if (months > 60) {
          interval = 6; // 5 anos ou mais: 6 em 6 meses
        } else if (months > 36) {
          interval = 5; // 3 a 5 anos: 5 em 5 meses
        } else if (months > 12) {
          interval = 3; // 1 a 3 anos: 3 em 3 meses
        }
    
        return Array.from({ length: months }, (_, i) =>
          i % interval === 0 || i === months - 1
            ? format(addMonths(minDate, i), 'MMM/yy', { locale: ptBR }).capitalize()
            : ''
        );
      }, [months, minDate]);

    // Função para calcular a posição e o tamanho da barra
    function calculateBarPosition(startDate: Date, endDate: Date, minDate: Date, maxDate: Date) {
        const totalDuration = maxDate.getTime() - minDate.getTime();
        const startOffset = ((startDate.getTime() - minDate.getTime()) / totalDuration) * 100;
        const endOffset = ((endDate.getTime() - minDate.getTime()) / totalDuration) * 100;
        const width = endOffset - startOffset;

        return { startOffset, width };
    }

    // Controla o Modal ao clicar no nome do cliente
    const openModal = (codigo: string) => {
        const url = `https://desenvolvimento.vaplink.com.br/dev/andre/Master/erp/cadastro/tclienteexibe.php?codigocliente=${codigo}`;
        setContent(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    // Fim do controle Modal

    // Tooltip para mostrar o nome completo do cliente
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: '#3b1a5a',
            fontSize: '16px',
            border: '1px solid #dadde9',
        },
    }));

    const handleChangeAno = (anoSelecionado: string) => {
        setAno(anoSelecionado);
    };

    // Renderiza de acordo com o estado da requisição
    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent errorMessage={error} />;

    return (
        <Box sx={{ width: '99vw', height: '99vh' }}>
            {/* Campo de pesquisa */}
            <Box sx={{ paddingX: 5, paddingY: 3, display: 'flex', gap: '.5rem' }}>
                <SelectAno onChangeAno={handleChangeAno} />
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
                            <div key={item.clc_cli_codigo} onClick={() => openModal(item.clc_cli_codigo)}>
                                <Box sx={{ height: 70, display: 'flex', alignItems: 'center', border: '1px solid #3b1a5a0f' }}>
                                    <HtmlTooltip title={
                                        <>
                                            {`[${item.clc_cli_codigo}] - ${(item.cli_nome)}`}
                                        </>
                                    } placement='right'>
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
                                            {`${item.cli_nome}`}
                                        </Typography>
                                    </HtmlTooltip>
                                </Box>
                            </div>
                        ))}
                    </Box>
                </Grid2>

                {/* B2: Barras */}
                <Grid2 size={10}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredData.map((item) => {
                            const itemStartDate = new Date(item.clc_datainicio);
                            const itemEndDate = new Date(item.clc_datafim) > maxDate ? maxDate : new Date(item.clc_datafim);

                            const { startOffset, width } = calculateBarPosition(
                                itemStartDate < minDate ? minDate : itemStartDate, // Se a data de início for menor que minDate, use minDate
                                itemEndDate > maxDate ? maxDate : itemEndDate, // Se a data de fim for maior que maxDate, use maxDate
                                minDate,
                                maxDate
                            );

                            return (
                                <Box key={item.clc_cli_codigo} sx={{ height: 70, position: 'relative', border: '1px solid #3b1a5a0f' }}>

                                    <BarAnimated width={width} startOffset={startOffset} item={item} />

                                </Box>
                            );
                        })}
                    </Box>
                </Grid2>
            </Grid2>

            <ModalCliente isOpen={isModalOpen} onClose={closeModal} url={content} />
        </Box>
    );
};

export default RelatorioDeUso;
