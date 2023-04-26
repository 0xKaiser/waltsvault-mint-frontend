import GSAP from 'gsap';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';
import App from './App';

GSAP.defaults({
  ease: 'power2',
  duration: 2.6,
  overwrite: true,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
