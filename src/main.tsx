import React from 'react';

import ReactDOM from 'react-dom/client';

import { MantineProvider } from '@mantine/core';

import { Provider } from 'react-redux';

import { store } from './store/store';

import '@mantine/core/styles.css';

import './App.css';

import App from './App';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);