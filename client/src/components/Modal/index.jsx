import { Modal } from 'react-bootstrap';
import styles from './style.module.css';

function ModalBS({ children, showModal, setShowModal, modalTitle, modalSize = "md" }) 
{
    return (
        <>
            {/* Modal */}
            <Modal animation backdrop="static" scrollable size={modalSize} aria-hidden="true"
            show={showModal} onHide={() => setShowModal(false)} className={styles.modal}>
                {/* Modal Header */}
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className="ms-auto">
                        <h2 className={styles.modalTitle}> { modalTitle?.toUpperCase() } </h2>
                    </Modal.Title>
                </Modal.Header>

                {/* Modal Body */}
                <Modal.Body className={styles.modalBody}> { children } </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalBS;