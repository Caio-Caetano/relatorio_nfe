import styled from "@emotion/styled";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';

function BarAnimated({ width, startOffset, item }: {
    width: number, startOffset: number, item: {
        clc_datainicio: Date;
        clc_datafim: Date;
        clc_cli_codigo: string;
        clc_valor: string;
        cli_nome: string;
    }
}) {
    const styles = useSpring({
        from: { width: '0%' },
        to: { width: `${width}%` },
        config: { duration: 1000 },
    });

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: '20px',
            border: '1px solid #dadde9',
        },
    }));

    return (
        <HtmlTooltip title={
            <>
                {`Data Início: ${format(item.clc_datainicio, 'MMM/yy', { locale: ptBR }).capitalize()}`} <br />
                {`Data Fim: ${format(item.clc_datafim, 'MMM/yy', { locale: ptBR }).capitalize()}`}
            </>
        } placement='top'>
            <animated.div
                style={{
                    ...styles,
                    position: 'absolute',
                    left: `${startOffset}%`,
                    height: '50%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(to right, #3b1a5a, #250048)`,
                    borderRadius: '.6rem',
                }}
            />
        </HtmlTooltip>

    )
}

export default BarAnimated;