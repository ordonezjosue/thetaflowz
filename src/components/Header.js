import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flame, LogOut, User, Crown, Zap, Gift, AlertTriangle } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, hasAccess, isPlanExpired, getRemainingDays } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (route) => {
    if (route === 'learn') {
      // Learn page is public, navigate directly
      navigate('/learn');
      return;
    }

    if (!currentUser) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    }

    if (!hasAccess(route)) {
      // No access, redirect to pricing
      navigate('/pricing');
      return;
    }

    // Has access, navigate normally
    navigate(`/${route}`);
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'premium':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'basic':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'free':
        return <Gift className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'premium':
        return 'text-purple-400';
      case 'basic':
        return 'text-blue-400';
      case 'free':
        return 'text-green-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getPlanName = (plan) => {
    switch (plan) {
      case 'premium':
        return 'Premium';
      case 'basic':
        return 'Basic';
      case 'free':
        return 'Free';
      default:
        return 'Expired';
    }
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
            <button
              onClick={() => handleNavigation('learn')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Learn
            </button>
            <button
              onClick={() => handleNavigation('market')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Market
            </button>
            <button
              onClick={() => handleNavigation('trades')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Trades
            </button>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
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
                {/* Plan Status */}
                <div className="flex items-center space-x-2">
                  {getPlanIcon(currentUser.plan)}
                  <span className={`text-sm font-medium ${getPlanColor(currentUser.plan)}`}>
                    {getPlanName(currentUser.plan)}
                  </span>
                  {currentUser.plan === 'free' && getRemainingDays() !== null && (
                    <span className="text-xs text-gray-400">
                      ({getRemainingDays()} days left)
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{currentUser.name}</span>
                </div>

                {/* Logout */}
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