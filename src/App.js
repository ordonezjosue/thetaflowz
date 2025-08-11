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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
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
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                } 
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
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            </Routes>
          </div>
        </Router>
      </MarketDataProvider>
    </AuthProvider>
  );
}

export default App; 