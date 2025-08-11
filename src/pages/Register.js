import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Gift, Zap, Crown } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Get plan from URL parameters
  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, selectedPlan);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = (plan) => {
    switch (plan) {
      case 'free':
        return {
          name: 'Free Plan',
          icon: Gift,
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          description: '7-day trial with Learn access only',
          features: ['Learn section access', 'Basic trading education', 'Community forum', '7-day trial']
        };
      case 'basic':
        return {
          name: 'Basic Plan',
          icon: Zap,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          description: 'Full access to basic features',
          features: ['All Free features', 'Market data (delayed)', 'Trade tracking', 'Email support']
        };
      case 'premium':
        return {
          name: 'Premium Plan',
          icon: Crown,
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          description: 'Complete access to all features',
          features: ['All Basic features', 'Real-time data', 'Advanced analytics', 'Priority support']
        };
      default:
        return {
          name: 'Free Plan',
          icon: Gift,
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          description: '7-day trial with Learn access only',
          features: ['Learn section access', 'Basic trading education', 'Community forum', '7-day trial']
        };
    }
  };

  const planInfo = getPlanInfo(selectedPlan);
  const IconComponent = planInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-gray-300">
            Start your options trading journey today
          </p>
        </div>

        {/* Plan Selection */}
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-full ${planInfo.bgColor}`}>
              <IconComponent className={`h-5 w-5 ${planInfo.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${planInfo.color}`}>{planInfo.name}</h3>
              <p className="text-sm text-gray-400">{planInfo.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {planInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {selectedPlan === 'free' && (
            <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-center">
              <p className="text-sm text-green-400">
                🎉 Start with our free plan - no credit card required!
              </p>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Creating account...' : `Create ${planInfo.name} Account`}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400">
                Sign in
              </Link>
            </p>
          </div>

          {selectedPlan !== 'free' && (
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Want to start free?{' '}
                <Link to="/register?plan=free" className="text-green-400 hover:text-green-300">
                  Try our free plan first
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register; 