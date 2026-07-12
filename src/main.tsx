import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import '@fontsource/pirata-one/latin-400.css';
import '@fontsource/im-fell-english-sc/latin-400.css';
import '@fontsource/crimson-text/latin-400.css';
import '@fontsource/crimson-text/latin-700.css';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
