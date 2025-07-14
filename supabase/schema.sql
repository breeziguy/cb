-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'customer');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled');
CREATE TYPE creator_status AS ENUM ('active', 'inactive');
CREATE TYPE interaction_type AS ENUM ('view', 'contact', 'collab');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    subscription_expires_at TIMESTAMPTZ,
    total_collabs INTEGER DEFAULT 0,
    monthly_collabs_used INTEGER DEFAULT 0,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creators table
CREATE TABLE creators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    whatsapp_number TEXT NOT NULL,
    platforms JSONB DEFAULT '{}',
    followers_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.0,
    category TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    price_range TEXT,
    portfolio_images JSONB DEFAULT '[]',
    video_portfolio JSONB DEFAULT '[]',
    instagram_profile TEXT,
    tiktok_profile TEXT,
    status creator_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_creator_interactions table
CREATE TABLE user_creator_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    interaction_type interaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL,
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    paystack_subscription_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_plan, subscription_status);
CREATE INDEX idx_creators_status ON creators(status);
CREATE INDEX idx_creators_category ON creators(category);
CREATE INDEX idx_user_creator_interactions_user_id ON user_creator_interactions(user_id);
CREATE INDEX idx_user_creator_interactions_creator_id ON user_creator_interactions(creator_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_creator_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Creators policies
CREATE POLICY "Anyone can view active creators" ON creators
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all creators" ON creators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User creator interactions policies
CREATE POLICY "Users can view their own interactions" ON user_creator_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON user_creator_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all interactions" ON user_creator_interactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset monthly collab usage (to be called monthly)
CREATE OR REPLACE FUNCTION reset_monthly_collabs()
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET monthly_collabs_used = 0
    WHERE subscription_plan IN ('basic', 'premium');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment collab usage
CREATE OR REPLACE FUNCTION increment_collab_usage(user_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET monthly_collabs_used = monthly_collabs_used + 1,
        total_collabs = total_collabs + 1
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 