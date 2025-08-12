import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import TradeTracker from './pages/TradeTracker';
import Market from './pages/Market';
import AdminDashboard from './pages/AdminDashboard';
import Pricing from './pages/Pricing';
import StockScreener from './pages/StockScreener';
import ProtectedRoute from './components/ProtectedRoute';
import TestPage from './pages/TestPage';

function App() {
  console.log('🚀 App component rendering...');
  console.log('📱 Environment:', process.env.NODE_ENV);
  console.log('🌐 PUBLIC_URL:', process.env.PUBLIC_URL);
  console.log('🔗 Current URL:', window.location.href);
  
  try {
    return (
      <AuthProvider>
        <MarketDataProvider>
          <Router basename={process.env.PUBLIC_URL}>
            <div className="min-h-screen bg-dark-900">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn" 
                  element={<Learn />}
                />
                <Route 
                  path="/trades" 
                  element={
                    <ProtectedRoute>
                      <TradeTracker />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/market" 
                  element={
                    <ProtectedRoute>
                      <Market />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pricing" 
                  element={<Pricing />}
                />
                <Route
                  path="/screener"
                  element={<StockScreener />}
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/test" 
                  element={<TestPage />}
                />
              </Routes>
            </div>
          </Router>
        </MarketDataProvider>
      </AuthProvider>
    );
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return (
      <div className="min-h-screen bg-red-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Error</h1>
          <p className="mb-4">Something went wrong while loading the app.</p>
          <pre className="bg-red-800 p-4 rounded text-sm overflow-auto max-w-md">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }
}

export default App; 