import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">🚨 Something went wrong</h1>
            <p className="mb-4">The app encountered an error and couldn't continue.</p>
            
            <details className="bg-red-800 p-4 rounded text-left">
              <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
              <div className="text-sm">
                <h3 className="font-semibold mb-2">Error:</h3>
                <pre className="bg-red-900 p-2 rounded overflow-auto text-xs mb-3">
                  {this.state.error && this.state.error.toString()}
                </pre>
                
                <h3 className="font-semibold mb-2">Component Stack:</h3>
                <pre className="bg-red-900 p-2 rounded overflow-auto text-xs">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            </details>
            
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
