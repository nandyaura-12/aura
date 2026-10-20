import React from 'react';
import { toast } from 'react-toastify';

/**
 * React-toast replacement for window.confirm().
 * Resolves true when the user clicks the confirm button, false otherwise.
 */
export const confirmToast = (message, { confirmLabel = 'Delete' } = {}) =>
  new Promise((resolve) => {
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    toast(
      ({ closeToast }) => (
        <div className="confirm-toast">
          <p>{message}</p>
          <div className="confirm-toast__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                settle(false);
                closeToast();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                settle(true);
                closeToast();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        className: 'confirm-toast-wrap',
        onClose: () => settle(false),
      }
    );
  });
