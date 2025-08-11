import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserTrades, setShowUserTrades] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data - replace with real API calls
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-01-20',
        subscription: 'premium',
        totalTrades: 45,
        totalPnL: 1250,
        winRate: 78.5
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        status: 'active',
        joinDate: '2024-01-10',
        lastLogin: '2024-01-19',
        subscription: 'basic',
        totalTrades: 23,
        totalPnL: 890,
        winRate: 82.6
      },
      {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        status: 'inactive',
        joinDate: '2023-12-01',
        lastLogin: '2024-01-05',
        subscription: 'basic',
        totalTrades: 12,
        totalPnL: -150,
        winRate: 58.3
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        status: 'active',
        joinDate: '2024-01-05',
        lastLogin: '2024-01-20',
        subscription: 'premium',
        totalTrades: 67,
        totalPnL: 2100,
        winRate: 71.6
      }
    ]);
  }, []);

  // Mock trade data for selected user
  const [userTrades, setUserTrades] = useState([]);

  const handleViewUserTrades = (user) => {
    setSelectedUser(user);
    // Mock trade data - replace with real API call
    setUserTrades([
      {
        id: 1,
        symbol: 'AAPL',
        strategy: 'Put Credit Spread',
        entryDate: '2024-01-15',
        exitDate: '2024-01-18',
        strikes: 'Short: $150, Long: $145',
        premium: 2.5,
        capital: 500,
        delta: -0.300,
        theta: 0.150,
        pnl: 250,
        status: 'closed'
      },
      {
        id: 2,
        symbol: 'TSLA',
        strategy: 'Call Credit Spread',
        entryDate: '2024-01-10',
        exitDate: null,
        strikes: 'Short: $200, Long: $205',
        premium: 3.0,
        capital: 80000,
        delta: 0.250,
        theta: -0.200,
        pnl: 0,
        status: 'open'
      },
      {
        id: 3,
        symbol: 'SPY',
        strategy: 'Wheel Strategy',
        entryDate: '2024-01-05',
        exitDate: '2024-01-12',
        strikes: 'Short: $400',
        premium: 1.5,
        capital: 40000,
        delta: -0.500,
        theta: 0.250,
        pnl: 300,
        status: 'closed'
      }
    ]);
    setShowUserTrades(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    premiumUsers: users.filter(u => u.subscription === 'premium').length,
    totalTrades: users.reduce((sum, u) => sum + u.totalTrades, 0),
    totalPnL: users.reduce((sum, u) => sum + u.totalPnL, 0)
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage users, view trade logs, and monitor platform performance</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-dark-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-primary-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-primary-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-green-500">{stats.activeUsers}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Premium Users</p>
                    <p className="text-2xl font-bold text-purple-500">{stats.premiumUsers}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Trades</p>
                    <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total P&L</p>
                    <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${stats.totalPnL.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Recent User Activity</h2>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Last login: {user.lastLogin}</p>
                      <p className="text-primary-500 text-sm capitalize">{user.subscription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="btn-secondary flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Subscription</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Performance</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <p className="text-gray-500 text-xs">Joined: {user.joinDate}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.subscription === 'premium' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscription}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-white">Trades: {user.totalTrades}</p>
                            <p className={`${user.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              P&L: ${user.totalPnL}
                            </p>
                            <p className="text-gray-400">Win Rate: {user.winRate}%</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewUserTrades(user)}
                              className="text-blue-500 hover:text-blue-400 p-1"
                              title="View Trades"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-500 hover:text-red-400 p-1"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Platform Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">This Month</span>
                      <span className="text-green-500">+12 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Month</span>
                      <span className="text-blue-500">+8 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Growth</span>
                      <span className="text-white">+45%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monthly Revenue</span>
                      <span className="text-green-500">$2,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Premium Conversion</span>
                      <span className="text-purple-500">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Churn Rate</span>
                      <span className="text-red-500">2.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Trades Modal */}
        {showUserTrades && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-dark-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Trade Log: {selectedUser.name}</h2>
                    <p className="text-gray-400">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => setShowUserTrades(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Trade</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Strategy</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Dates</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Strikes</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Greeks</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">P&L</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-dark-700">
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-white font-medium">{trade.symbol}</p>
                              <p className="text-gray-400 text-sm">ID: {trade.id}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{trade.strategy}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p className="text-gray-300">Entry: {trade.entryDate}</p>
                              <p className="text-gray-400">Exit: {trade.exitDate || 'Open'}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300 text-sm">{trade.strikes}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p className="text-gray-300">Δ: {trade.delta}</p>
                              <p className="text-gray-400">Θ: {trade.theta}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p className={`font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${trade.pnl}
                              </p>
                              <p className="text-gray-400">Premium: ${trade.premium}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              trade.status === 'closed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {trade.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {showDeleteConfirm && userToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Delete User</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-3">
                  Are you sure you want to permanently delete this user?
                </p>
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 font-medium">{userToDelete.name}</p>
                  <p className="text-red-300 text-sm">{userToDelete.email}</p>
                  <p className="text-red-300 text-sm">This action cannot be undone.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 