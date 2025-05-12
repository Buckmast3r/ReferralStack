import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalytics, exportAnalytics, subscribeToAnalytics, trackPerformance } from '../utils/analyticsService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [filters, setFilters] = useState({
    category: '',
    referralId: '',
    source: '',
    startDate: '',
    endDate: ''
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const renderStartTime = useRef(performance.now());

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(user.id, timeRange, filters);
      setAnalytics(data);

      // Track render performance
      const renderTime = performance.now() - renderStartTime.current;
      await trackPerformance(user.id, {
        apiResponseTime: 0, // Set by the service
        renderTime,
        memoryUsage: performance.memory?.usedJSHeapSize || 0
      });
    } catch (err) {
      setError('Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [user.id, timeRange, filters]);

  useEffect(() => {
    fetchAnalytics();
    renderStartTime.current = performance.now();

    // Set up real-time updates
    let unsubscribe;
    if (realTimeUpdates) {
      unsubscribe = subscribeToAnalytics(user.id, (newClick) => {
        setAnalytics(prev => {
          if (!prev) return null;

          // Update total clicks
          const updatedAnalytics = {
            ...prev,
            totalClicks: prev.totalClicks + 1
          };

          // Update clicks by time
          const date = new Date(newClick.clicked_at).toISOString().split('T')[0];
          updatedAnalytics.clicksByTime[date] = (updatedAnalytics.clicksByTime[date] || 0) + 1;

          // Update recent activity
          updatedAnalytics.recentActivity = [
            newClick,
            ...prev.recentActivity.slice(0, 9)
          ];

          return updatedAnalytics;
        });
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAnalytics, user.id, realTimeUpdates]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setTimeRange('custom');
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const success = await exportAnalytics(user.id, timeRange, filters, exportFormat);
      if (success) {
        toast.success(`Analytics exported successfully as ${exportFormat.toUpperCase()}`);
      } else {
        toast.error('Failed to export analytics');
      }
    } catch (err) {
      toast.error('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!analytics) return <div className="text-center py-8">No analytics data available</div>;

  // Prepare data for charts
  const timeSeriesData = Object.entries(analytics.clicksByTime).map(([date, clicks]) => ({
    date,
    clicks
  }));

  const topReferralsData = analytics.topReferrals.slice(0, 5).map(ref => ({
    name: ref.title,
    clicks: ref.clicks
  }));

  const categoryData = analytics.categories.map(cat => ({
    name: cat.category,
    value: cat.clicks
  }));

  const sourceData = analytics.sources.map(src => ({
    name: src.source,
    value: src.clicks
  }));

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export'}
          </button>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={realTimeUpdates}
              onChange={(e) => setRealTimeUpdates(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm text-gray-600">Real-time updates</span>
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {analytics.categories.map(cat => (
            <option key={cat.category} value={cat.category}>{cat.category}</option>
          ))}
        </select>
        <select
          name="source"
          value={filters.source}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sources</option>
          {analytics.sources.map(src => (
            <option key={src.source} value={src.source}>{src.source}</option>
          ))}
        </select>
        {timeRange === 'custom' && (
          <div className="flex space-x-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleDateRangeChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleDateRangeChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalClicks}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Referrals</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.topReferrals.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.categories.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg. Clicks/Day</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(analytics.totalClicks / timeSeriesData.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Click Trends Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Click Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Referrals Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Referrals</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topReferralsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Traffic Sources</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Click Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Clicks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referral
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.referrals.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.referrals.links[activity.link_index]?.label || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.clicked_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.referrer || 'Direct'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">User Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.userActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.activity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {JSON.stringify(activity.details)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 