import Lottie from 'lottie-react';
import loading from '../assets/lotties/loading.json';

function LoadingComponent() {
    return (
        <div style={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Lottie animationData={loading} loop={true} style={{ width: 400, height: 400 }} />
            <p style={{ color: '#000', fontSize: '24px' }}>
                <span>Buscando informações</span>
            </p>
        </div>
    )
}

export default LoadingComponent;