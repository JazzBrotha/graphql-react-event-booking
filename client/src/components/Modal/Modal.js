import React from 'react';

const Modal = ({
  children,
  title,
  canCancel,
  canConfirm,
  onCancel,
  onConfirm
}) => (
  <div className="modal">
    <header>
      <h1>{title}</h1>
    </header>
    <section>{children}</section>
    <section>
      {canCancel && <button onClick={onCancel}>Cancel</button>}
      {canConfirm && <button onClick={onConfirm}>Confirm</button>}
    </section>
  </div>
);

export default Modal;
