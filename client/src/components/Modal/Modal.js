import React from 'react';

const Modal = ({
  children,
  title,
  canCancel,
  canConfirm,
  onCancel,
  onConfirm,
  confirmText
}) => (
  <div className="modal">
    <header>
      <h1>{title}</h1>
    </header>
    <section>{children}</section>
    <section>
      {canCancel && <button onClick={onCancel}>Cancel</button>}
      {canConfirm && <button onClick={onConfirm}>{confirmText}</button>}
    </section>
  </div>
);

export default Modal;
