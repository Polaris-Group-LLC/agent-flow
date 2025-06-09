-- AgentFlow Database Setup
-- Created: 2025-01-27
-- Description: Creates the flows table and sets up Row Level Security

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create flows table
CREATE TABLE public.flows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'Untitled Flow',
    description TEXT DEFAULT '',
    graph_json JSONB DEFAULT '{"nodes": [], "edges": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own flows
CREATE POLICY "Users can view their own flows" ON public.flows
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own flows
CREATE POLICY "Users can insert their own flows" ON public.flows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own flows
CREATE POLICY "Users can update their own flows" ON public.flows
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own flows
CREATE POLICY "Users can delete their own flows" ON public.flows
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_flows_updated
    BEFORE UPDATE ON public.flows
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.flows TO authenticated;
GRANT ALL ON public.flows TO service_role;

-- Optional: Create an index for better performance on user_id queries
CREATE INDEX flows_user_id_idx ON public.flows(user_id);
CREATE INDEX flows_updated_at_idx ON public.flows(updated_at DESC); 