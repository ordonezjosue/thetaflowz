import React from 'react';

const TestPage = () => {
  console.log('🧪 TestPage component rendering...');
  
  return (
    <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🧪 Test Page</h1>
        <p className="text-xl mb-4">If you can see this, React is working!</p>
        <div className="bg-blue-800 p-4 rounded">
          <p className="text-sm">Current URL: {window.location.href}</p>
          <p className="text-sm">User Agent: {navigator.userAgent}</p>
          <p className="text-sm">Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
