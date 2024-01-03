import React from 'react';
import ReactDOM from 'react-dom';
import '../styling/Modal.css'; 

const Modal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        {children}
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default Modal;
