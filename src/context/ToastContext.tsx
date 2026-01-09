import React, { createContext, useContext, useId } from 'react';
import {
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from '@fluentui/react-components';
import type { ToastIntent } from '@fluentui/react-components';

type NotifyFunction = (intent: ToastIntent, title: string, body?: string) => void;

const ToastContext = createContext<NotifyFunction | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toasterId = useId();
  const { dispatchToast } = useToastController(toasterId);

  const notify: NotifyFunction = (intent, title, body) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        {body && <ToastBody>{body}</ToastBody>}
      </Toast>,
      { intent }
    );
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <Toaster toasterId={toasterId} />
    </ToastContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useNotify must be used within a ToastProvider');
  }
  return context;
};
