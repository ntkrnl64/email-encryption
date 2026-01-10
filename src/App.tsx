import React, { useEffect, useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme
} from '@fluentui/react-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { Generator } from './pages/Generator';
import { Redirector } from './pages/Redirector';
import { NotFound } from './pages/NotFound';
import { Footer } from './components/Footer';

const useSystemTheme = () => {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? webDarkTheme
      : webLightTheme
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? webDarkTheme : webLightTheme);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return theme;
};

const App: React.FC = () => {
  const currentTheme = useSystemTheme();

  return (
    <FluentProvider theme={currentTheme}>
      <ToastProvider>
        <div style={{
          backgroundColor: currentTheme.colorNeutralBackground2,
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <BrowserRouter>
            <div style={{ flex: 1, width: '100%' }}>
              <Routes>
                <Route path="/" element={<Generator />} />
                <Route path="/:method/:payload" element={<Redirector />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            <Footer />
            
          </BrowserRouter>
        </div>
      </ToastProvider>
    </FluentProvider>
  );
};

export default App;
