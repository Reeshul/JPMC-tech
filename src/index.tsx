import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

declare global {
  interface Window {
    perspective: any;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
