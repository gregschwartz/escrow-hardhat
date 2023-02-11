import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!window.ethereum) {
  root.render(
    <React.StrictMode>
      You need to install a browser wallet to build the escrow dapp
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <link href="/dist/output.css" rel="stylesheet" />
      <a href="/crow4.png" target="_blank"><img src="/crow4-small.png" alt="esCrow" className='mx-auto content-center place-items-center' /></a>
      <h1 className='text-8xl	font-mono text-center'>esCROW</h1>
      <h2 className='font-mono text-center'>Stolen funds? Nevermore!</h2>
      <div className='container px-4 flex flex-row'>
        <App />
      </div>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
