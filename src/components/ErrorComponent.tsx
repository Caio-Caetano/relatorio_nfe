import Lottie from 'lottie-react';
import error from '../assets/lotties/erro.json';

function ErrorComponent({errorMessage}: {errorMessage: string}) {
    return (
        <div style={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Lottie animationData={error} loop={false} style={{ width: 400, height: 400 }} />
            <p style={{ color: '#000', fontSize: '24px' }}>
                <span>Erro: {errorMessage}</span>
            </p>
        </div>
    )
}

export default ErrorComponent;