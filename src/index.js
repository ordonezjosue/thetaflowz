import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('🚀 index.js executing...');
console.log('📱 Environment:', process.env.NODE_ENV);
console.log('🌐 PUBLIC_URL:', process.env.PUBLIC_URL);
console.log('🔗 Current URL:', window.location.href);
console.log('🏠 Root element:', document.getElementById('root'));

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('✅ Root created successfully');
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Error in index.js:', error);
  document.body.innerHTML = `
    <div style="background: #dc2626; color: white; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Critical Error</h1>
      <p>The app failed to load. Check the console for details.</p>
      <pre style="background: #991b1b; padding: 10px; border-radius: 4px; overflow: auto;">
        ${error.message}
      </pre>
    </div>
  `;
} 