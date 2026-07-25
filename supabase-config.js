// Supabase Configuration
const SUPABASE_URL = 'https://yjpoxnnkmuobfphomcop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcG94bm5rbXVvYmZwaG9tY29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NDYzMTksImV4cCI6MjEwMDMyMjMxOX0.9FSS3McshKIvGz4gaCEgELezSEbNYCxNVMmpxiptiRY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
