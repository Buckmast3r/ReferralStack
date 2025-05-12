import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPerformanceMetrics,
  getErrorLogs
} from '../utils/monitoringService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Monitoring = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('24h');
  const [performanceData, setPerformanceData] = useState(null);
  const [errorLogs, setErrorLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metrics, errors] = await Promise.all([
          getPerformanceMetrics(user.id, timeRange),
          getErrorLogs(user.id, timeRange)
        ]);
        setPerformanceData(metrics);
        setErrorLogs(errors);
      } catch (err) {
        setError('Failed to load monitoring data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, timeRange]);

  if (loading) return <div className="text-center py-8">Loading monitoring data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  // Prepare performance data for charts
  const performanceChartData = performanceData?.map(log => ({
    timestamp: new Date(log.created_at).toLocaleString(),
    apiResponseTime: log.metrics.apiResponseTime,
    renderTime: log.metrics.renderTime,
    memoryUsage: log.metrics.memoryUsage / (1024 * 1024) // Convert to MB
  }));

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg. API Response Time</h3>
          <p className="text-3xl font-bold text-blue-600">
            {performanceData?.reduce((acc, log) => acc + log.metrics.apiResponseTime, 0) / performanceData?.length || 0}ms
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg. Render Time</h3>
          <p className="text-3xl font-bold text-blue-600">
            {performanceData?.reduce((acc, log) => acc + log.metrics.renderTime, 0) / performanceData?.length || 0}ms
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg. Memory Usage</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(performanceData?.reduce((acc, log) => acc + log.metrics.memoryUsage, 0) / performanceData?.length / (1024 * 1024) || 0).toFixed(2)}MB
          </p>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="apiResponseTime" stroke="#3B82F6" name="API Response Time (ms)" />
                <Line type="monotone" dataKey="renderTime" stroke="#10B981" name="Render Time (ms)" />
                <Line type="monotone" dataKey="memoryUsage" stroke="#F59E0B" name="Memory Usage (MB)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Error Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Context
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorLogs?.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.error_details.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.error_details.context, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Monitoring; 