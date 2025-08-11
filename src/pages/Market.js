import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MarketOverview from '../components/MarketOverview';
import AccessRestricted from '../components/AccessRestricted';

const Market = () => {
  const { currentUser, hasAccess } = useAuth();

  // Check if user has access to market features
  if (!hasAccess('market')) {
    return (
      <AccessRestricted 
        feature="market" 
        currentPlan={currentUser?.plan} 
        requiredPlan="basic" 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketOverview />
    </div>
  );
};

export default Market; 