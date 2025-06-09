# AgentFlow Setup Guide

> **Created**: 2025-01-27  
> **Issue**: Supabase API returning 404 errors for `/flows` table  
> **Solution**: Database table doesn't exist and needs to be created

## Quick Fix Steps

### 1. Create the Database Table

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project: `ekdidmjcsswasrwmpaxm`
3. Navigate to **SQL Editor** in the left sidebar
4. Create a new query and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute the SQL

### 2. Verify the Setup

After running the SQL, test the connection:

```bash
# Test if the table exists (should return empty array, not 404)
curl -H "apikey: YOUR_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     "https://ekdidmjcsswasrwmpaxm.supabase.co/rest/v1/flows"
```

### 3. Test Authentication

1. Go to `http://localhost:3000/login`
2. Enter your email to receive a magic link
3. Click the magic link to authenticate
4. Navigate to `/dashboard` - you should see the flows interface

## What the SQL Does

- ✅ Creates the `flows` table with proper schema
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Creates automatic `updated_at` timestamp triggers
- ✅ Adds performance indexes
- ✅ Configures proper permissions

## Table Schema

```sql
flows (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT DEFAULT 'Untitled Flow',
    description TEXT DEFAULT '',
    graph_json JSONB DEFAULT '{"nodes": [], "edges": []}',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
```

## Troubleshooting

### Still getting 404 errors?

- Verify the SQL executed successfully without errors
- Check that RLS policies are enabled
- Ensure you're authenticated (magic link clicked)

### Authentication issues?

- Check `.env.local` has correct Supabase credentials
- Verify your Supabase project URL matches
- Ensure email authentication is enabled in Supabase Auth settings

### Need help?

- Check the Supabase dashboard for any error messages
- Verify your project is not paused (free tier limitation)
- Check browser console for detailed error messages

## Next Steps

Once the table is created and you can authenticate:

1. ✅ Create your first flow via the Dashboard
2. ✅ Use the visual node editor in the Builder
3. ✅ Set up additional authentication providers if needed
4. ✅ Configure any additional tables for your specific use case

---

**Note**: The application expects Supabase Auth to be properly configured. The login page uses magic links by default, which requires email configuration in your Supabase project settings.
