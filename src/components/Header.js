import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flame, LogOut, User } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold text-white">ThetaFlowz</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/learn" className="text-gray-300 hover:text-white transition-colors">
              Learn
            </Link>
            <Link to="/market" className="text-gray-300 hover:text-white transition-colors">
              Market
            </Link>
            <Link to="/trades" className="text-gray-300 hover:text-white transition-colors">
              Trades
            </Link>
            {currentUser?.isAdmin && (
              <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Join now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 