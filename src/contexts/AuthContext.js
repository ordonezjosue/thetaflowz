import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication - in production, this would connect to Firebase or your backend
  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const user = {
      id: '1',
      email,
      name: email.split('@')[0],
      isAdmin: email === 'ordonezjosue@gmail.com',
      plan: email === 'ordonezjosue@gmail.com' ? 'premium' : 'free', // Admin gets premium access
      planExpiry: email === 'ordonezjosue@gmail.com' ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: new Date().toISOString()
    };
    
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const register = async (email, password, name, plan = 'free') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: Date.now().toString(),
      email,
      name,
      isAdmin: false,
      plan: plan,
      planExpiry: plan === 'free' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null, // 7 days for free plan
      createdAt: new Date().toISOString()
    };
    
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Check if user has access to a specific feature
  const hasAccess = (feature) => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true; // Admin has access to everything
    
    switch (feature) {
      case 'learn':
        return true; // All users can access learn
      case 'market':
        return currentUser.plan !== 'free';
      case 'trades':
        return currentUser.plan !== 'free';
      case 'premium':
        return currentUser.plan === 'premium';
      default:
        return false;
    }
  };

  // Check if user's plan is expired
  const isPlanExpired = () => {
    if (!currentUser || currentUser.isAdmin) return false;
    if (currentUser.plan !== 'free') return false;
    
    return new Date() > new Date(currentUser.planExpiry);
  };

  // Get remaining days for free plan
  const getRemainingDays = () => {
    if (!currentUser || currentUser.isAdmin || currentUser.plan !== 'free') return null;
    
    const now = new Date();
    const expiry = new Date(currentUser.planExpiry);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // Check if free plan has expired
      if (user.plan === 'free' && user.planExpiry) {
        if (new Date() > new Date(user.planExpiry)) {
          // Plan expired, update user
          user.plan = 'expired';
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    hasAccess,
    isPlanExpired,
    getRemainingDays
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 