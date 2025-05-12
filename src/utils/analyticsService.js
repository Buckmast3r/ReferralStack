import { supabase } from './supabaseClient';
import { sendReferralClickedEmail } from './emailService';

// Cache for analytics data
const analyticsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Activity types for logging
const ACTIVITY_TYPES = {
  REFERRAL_CREATED: 'referral_created',
  REFERRAL_UPDATED: 'referral_updated',
  REFERRAL_DELETED: 'referral_deleted',
  LINK_CLICKED: 'link_clicked',
  PROFILE_UPDATED: 'profile_updated',
  SUBSCRIPTION_CHANGED: 'subscription_changed',
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_ISSUE: 'performance_issue'
};

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: 1000, // 1 second
  RENDER_TIME: 100, // 100ms
  MEMORY_USAGE: 50 * 1024 * 1024 // 50MB
};

export const logUserActivity = async (userId, activityType, details = {}) => {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        details,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging user activity:', error);
    return false;
  }
};

export const trackClick = async (referralId, linkIndex) => {
  try {
    // Get the referral data
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();

    if (fetchError) throw fetchError;

    // Increment click count
    const { error: updateError } = await supabase
      .from('referrals')
      .update({ clicks: (referral.clicks || 0) + 1 })
      .eq('id', referralId);

    if (updateError) throw updateError;

    // Log click event
    const { error: logError } = await supabase
      .from('click_logs')
      .insert({
        referral_id: referralId,
        link_index: linkIndex,
        clicked_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });

    if (logError) throw logError;

    // Invalidate cache
    analyticsCache.clear();

    // Send notification email if click count is a milestone (e.g., every 10 clicks)
    const newClickCount = (referral.clicks || 0) + 1;
    if (newClickCount % 10 === 0) {
      await sendReferralClickedEmail(referral.user_id, referral, newClickCount);
    }

    return true;
  } catch (error) {
    console.error('Error tracking click:', error);
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

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        user_id: userId,
        error_details: errorDetails,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    // Log as user activity
    await logUserActivity(userId, ACTIVITY_TYPES.ERROR_OCCURRED, errorDetails);
    return true;
  } catch (err) {
    console.error('Error tracking error:', err);
    return false;
  }
};

export const trackPerformance = async (userId, metrics) => {
  try {
    const { error: dbError } = await supabase
      .from('performance_logs')
      .insert({
        user_id: userId,
        metrics,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

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
      await logUserActivity(userId, ACTIVITY_TYPES.PERFORMANCE_ISSUE, {
        issues,
        metrics
      });
    }

    return true;
  } catch (err) {
    console.error('Error tracking performance:', err);
    return false;
  }
};

export const subscribeToAnalytics = (userId, callback) => {
  const subscription = supabase
    .from('click_logs')
    .on('INSERT', payload => {
      if (payload.new.user_id === userId) {
        callback(payload.new);
      }
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

export const getAnalytics = async (userId, timeRange = '7d', filters = {}) => {
  try {
    const startTime = performance.now();
    const cacheKey = `${userId}-${timeRange}-${JSON.stringify(filters)}`;
    const cachedData = analyticsCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const now = new Date();
    let startDate = new Date();
    
    // Set start date based on time range
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'custom':
        startDate = new Date(filters.startDate);
        now = new Date(filters.endDate);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Build query based on filters
    let query = supabase
      .from('click_logs')
      .select(`
        *,
        referrals (
          title,
          links,
          category
        )
      `)
      .gte('clicked_at', startDate.toISOString())
      .lte('clicked_at', now.toISOString());

    // Apply additional filters
    if (filters.category) {
      query = query.eq('referrals.category', filters.category);
    }
    if (filters.referralId) {
      query = query.eq('referral_id', filters.referralId);
    }
    if (filters.source) {
      query = query.eq('referrer', filters.source);
    }

    const { data: clickLogs, error: logsError } = await query.order('clicked_at', { ascending: false });

    if (logsError) throw logsError;

    // Get user activity logs
    const { data: activityLogs, error: activityError } = await supabase
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: false });

    if (activityError) throw activityError;

    // Process analytics data
    const analytics = {
      totalClicks: clickLogs.length,
      clicksByReferral: {},
      clicksByTime: {},
      clicksByCategory: {},
      clicksBySource: {},
      topReferrals: [],
      recentActivity: clickLogs.slice(0, 10),
      userActivity: activityLogs.slice(0, 10)
    };

    // Process clicks by referral and category
    clickLogs.forEach(log => {
      const referral = log.referrals;
      
      // Process by referral
      if (!analytics.clicksByReferral[referral.id]) {
        analytics.clicksByReferral[referral.id] = {
          title: referral.title,
          clicks: 0,
          links: referral.links,
          category: referral.category
        };
      }
      analytics.clicksByReferral[referral.id].clicks++;

      // Process by category
      if (referral.category) {
        analytics.clicksByCategory[referral.category] = (analytics.clicksByCategory[referral.category] || 0) + 1;
      }

      // Process by source
      const source = log.referrer || 'Direct';
      analytics.clicksBySource[source] = (analytics.clicksBySource[source] || 0) + 1;
    });

    // Convert to arrays and sort
    analytics.topReferrals = Object.entries(analytics.clicksByReferral)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.clicks - a.clicks);

    analytics.categories = Object.entries(analytics.clicksByCategory)
      .map(([category, clicks]) => ({ category, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    analytics.sources = Object.entries(analytics.clicksBySource)
      .map(([source, clicks]) => ({ source, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    // Process clicks by time
    clickLogs.forEach(log => {
      const date = new Date(log.clicked_at).toISOString().split('T')[0];
      analytics.clicksByTime[date] = (analytics.clicksByTime[date] || 0) + 1;
    });

    // Cache the results
    analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now()
    });

    // Track performance
    const endTime = performance.now();
    await trackPerformance(userId, {
      apiResponseTime: endTime - startTime,
      renderTime: 0, // Will be set by the component
      memoryUsage: performance.memory?.usedJSHeapSize || 0
    });

    return analytics;
  } catch (error) {
    await trackError(userId, error, { timeRange, filters });
    console.error('Error getting analytics:', error);
    return null;
  }
};

export const exportAnalytics = async (userId, timeRange = '7d', filters = {}, format = 'csv') => {
  try {
    const analytics = await getAnalytics(userId, timeRange, filters);
    if (!analytics) throw new Error('No analytics data available');

    let content;
    let mimeType;
    let fileExtension;

    switch (format) {
      case 'json':
        content = JSON.stringify(analytics, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'csv':
        // Prepare CSV data
        const headers = ['Date', 'Referral Title', 'Link Label', 'Clicks', 'Source'];
        const rows = [];

        // Add time series data
        Object.entries(analytics.clicksByTime).forEach(([date, clicks]) => {
          rows.push([date, 'All Referrals', 'Total', clicks, '']);
        });

        // Add referral data
        analytics.topReferrals.forEach(referral => {
          referral.links.forEach((link, index) => {
            rows.push([
              new Date().toISOString().split('T')[0],
              referral.title,
              link.label,
              referral.clicks,
              ''
            ]);
          });
        });

        content = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        mimeType = 'text/csv;charset=utf-8;';
        fileExtension = 'csv';
        break;
      default:
        throw new Error('Unsupported export format');
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${fileExtension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    await trackError(userId, error, { timeRange, filters, format });
    console.error('Error exporting analytics:', error);
    return false;
  }
};

export const checkLinkLimit = async (userId) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Pro users have no limit
    if (profile.subscription_status === 'pro') {
      return true;
    }

    // Check total links for free users
    const { data: referrals, error: countError } = await supabase
      .from('referrals')
      .select('links')
      .eq('user_id', userId);

    if (countError) throw countError;

    const totalLinks = referrals.reduce((sum, ref) => sum + (ref.links?.length || 0), 0);
    return totalLinks < 5; // Free users limited to 5 links
  } catch (error) {
    console.error('Error checking link limit:', error);
    return false;
  }
}; 