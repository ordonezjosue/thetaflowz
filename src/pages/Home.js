import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BookOpen, BarChart3, Users, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learn Strategies",
      description: "Master put credit spreads, call credit spreads, wheel strategies, and naked puts."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Track Trades",
      description: "Monitor your performance with detailed trade tracking and analytics."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Build Wealth",
      description: "Grow your portfolio through systematic options selling strategies."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Management",
      description: "Learn proper position sizing and risk control techniques."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Options made simple.
            <br />
            <span className="text-primary-500">Wealth made possible.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Unlock easy-to-use screeners, trade tracking, and step-by-step guides. 
            Learn how selling options can grow your confidence and your portfolio—no experience required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Join now
            </Link>
            <Link to="/learn" className="btn-secondary text-lg px-8 py-3">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From beginner to advanced, we provide the tools and education to master options trading.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-500/10 rounded-lg text-primary-500">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your options trading journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who are already building wealth through options selling strategies.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 