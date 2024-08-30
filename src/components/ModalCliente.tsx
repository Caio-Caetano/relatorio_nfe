import { Backdrop, Box, Fade, Modal } from "@mui/material";

const styles = {
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '80%',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  };

interface ModalProps {
    url: string;
    isOpen: boolean;
    onClose: () => void;
}

function ModalCliente(props: ModalProps) {
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.isOpen}
                onClose={props.onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={props.isOpen}>
                    <Box sx={styles.modal}>
                        <iframe src={props.url} style={styles.iframe} title="Detalhes do Cliente" />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalCliente;