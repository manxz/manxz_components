/**
 * Web Preview Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import '../web-font-loader';
import './fonts.css';
// import App from './App';
import DebugApp from './DebugApp';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<DebugApp />);
}

