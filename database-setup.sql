-- HR Recruitment System Database Setup for Supabase

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    department TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary TEXT,
    status TEXT DEFAULT 'Active',
    applications INTEGER DEFAULT 0,
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    experience TEXT NOT NULL,
    current_job_role TEXT,
    skills TEXT NOT NULL,
    cover_letter TEXT,
    expected_salary TEXT,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    department TEXT NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Pending',
    interview_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_name TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    type TEXT DEFAULT 'In-person',
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table to store additional user info (role, etc.)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'applicant' or 'hr'
    department TEXT, -- for HR users
    employee_id TEXT, -- for HR users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'Active');
CREATE POLICY "HR users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "HR users can update their jobs" ON jobs FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "HR users can delete their jobs" ON jobs FOR DELETE USING (created_by = auth.uid());

-- Create policies for applications table
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "HR users can view all applications" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);
CREATE POLICY "Users can insert applications" ON applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "HR users can update applications" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);
CREATE POLICY "HR users can delete applications" ON applications FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);

-- Create policies for interviews table
CREATE POLICY "HR users can view all interviews" ON interviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);
CREATE POLICY "HR users can insert interviews" ON interviews FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);
CREATE POLICY "HR users can update interviews" ON interviews FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);
CREATE POLICY "HR users can delete interviews" ON interviews FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'hr')
);

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_interviews_date ON interviews(date);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
