import { supabase } from './supabaseClient';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: 1000, // 1 second
  RENDER_TIME: 100, // 100ms
  MEMORY_USAGE: 50 * 1024 * 1024 // 50MB
};

// Error severity levels
const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const trackPerformance = async (userId, metrics) => {
  try {
    const { error } = await supabase
      .from('performance_logs')
      .insert({
        user_id: userId,
        metrics,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    // Check for performance issues
    const issues = [];
    if (metrics.apiResponseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME) {
      issues.push('API response time exceeded threshold');
    }
    if (metrics.renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME) {
      issues.push('Render time exceeded threshold');
    }
    if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_USAGE) {
      issues.push('Memory usage exceeded threshold');
    }

    if (issues.length > 0) {
      await logPerformanceIssue(userId, issues, metrics);
    }

    return true;
  } catch (error) {
    console.error('Error tracking performance:', error);
    return false;
  }
};

export const trackError = async (userId, error, context = {}) => {
  try {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    const severity = determineErrorSeverity(error);

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        user_id: userId,
        error_details: errorDetails,
        severity,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    // If critical error, notify admin
    if (severity === ERROR_SEVERITY.CRITICAL) {
      await notifyAdmin(userId, errorDetails);
    }

    return true;
  } catch (err) {
    console.error('Error tracking error:', err);
    return false;
  }
};

const determineErrorSeverity = (error) => {
  // Check for critical errors
  if (error.message.includes('database') || error.message.includes('auth')) {
    return ERROR_SEVERITY.CRITICAL;
  }
  
  // Check for high severity errors
  if (error.message.includes('payment') || error.message.includes('subscription')) {
    return ERROR_SEVERITY.HIGH;
  }
  
  // Check for medium severity errors
  if (error.message.includes('api') || error.message.includes('network')) {
    return ERROR_SEVERITY.MEDIUM;
  }
  
  // Default to low severity
  return ERROR_SEVERITY.LOW;
};

const logPerformanceIssue = async (userId, issues, metrics) => {
  try {
    const { error } = await supabase
      .from('performance_issues')
      .insert({
        user_id: userId,
        issues,
        metrics,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging performance issue:', error);
    return false;
  }
};

const notifyAdmin = async (userId, errorDetails) => {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        user_id: userId,
        type: 'critical_error',
        details: errorDetails,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error notifying admin:', error);
    return false;
  }
};

export const getPerformanceMetrics = async (userId, timeRange = '24h') => {
  try {
    const startDate = new Date();
    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    const { data, error } = await supabase
      .from('performance_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return null;
  }
};

export const getErrorLogs = async (userId, timeRange = '24h') => {
  try {
    const startDate = new Date();
    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting error logs:', error);
    return null;
  }
}; 