import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-supabase-url.supabase.cohttps://itvpztiiwzxhdtpodjlq.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnB6dGlpd3p4aGR0cG9kamxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTIyMzksImV4cCI6MjA2MTI2ODIzOX0.JLHi8tQceY5Fy3G878Wu258L9CK10FEJyddmXiCpbPc'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
