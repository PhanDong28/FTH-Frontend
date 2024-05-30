import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccessToast = (message) => {
    toast.success(message);
  };

  const showErrorToast = (message) => {
    toast.error(message);
  };

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);