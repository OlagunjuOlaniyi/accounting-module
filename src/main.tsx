import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './sass/base.scss';
import './sass/utils.scss';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster position='top-right' reverseOrder={false} />
    <App />
  </React.StrictMode>
);
