import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircleIcon, AlertTriangleIcon } from './Icons';

// Import dedicated component stylesheet
import './Toast.css';

/**
 * ============================================================================
 * Toast Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Subtle, non-intrusive floating feedback banner rendered globally in App.js.
 *   Shows success notifications (e.g., "Added to Cart") or error alerts.
 */
export const Toast = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {isSuccess ? (
        <span className="toast-icon-success">
          <CheckCircleIcon size={16} />
        </span>
      ) : (
        <span className="toast-icon-warning">
          <AlertTriangleIcon size={16} />
        </span>
      )}
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};
