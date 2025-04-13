import React from 'react';
import ReactDOM from 'react-dom/client'; // Alterado para importar o método correto
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Alteração: Usar createRoot ao invés de render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Medição de performance (caso queira usar)
reportWebVitals();
