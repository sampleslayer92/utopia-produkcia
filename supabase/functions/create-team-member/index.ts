
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Verifying user token...')

    // Verify user with service role client (bypasses RLS)
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError) {
      console.error('User verification error:', userError)
      throw new Error('Invalid token')
    }

    if (!user) {
      console.error('No user found from token')
      throw new Error('Unauthorized - no user')
    }

    console.log('User verified:', user.email, 'ID:', user.id)

    // Check if user is admin using service role client (bypasses RLS)
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('Role check result:', { userRole, roleError })

    if (roleError) {
      console.error('Role check error:', roleError)
      throw new Error('Error checking user role: ' + roleError.message)
    }

    if (!userRole || userRole.role !== 'admin') {
      console.error('User role check failed:', { 
        userId: user.id, 
        email: user.email, 
        foundRole: userRole?.role || 'none' 
      })
      throw new Error('User not authorized - admin role required')
    }

    console.log('Admin role verified for user:', user.email)

    // Get request body
    const body = await req.json()
    const { first_name, last_name, email, phone, password, role } = body

    console.log('Creating user with data:', { first_name, last_name, email, role })

    // Create user in Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        first_name,
        last_name,
      },
      email_confirm: true
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error('Failed to create user: ' + authError.message)
    }

    console.log('User created in auth:', authData.user?.id)

    // Update profile with phone number if provided
    if (authData.user && phone) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ phone })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      } else {
        console.log('Profile updated with phone number')
      }
    }

    // Assign role
    if (authData.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role
        })

      if (roleError) {
        console.error('Role assignment error:', roleError)
        throw new Error('Failed to assign role: ' + roleError.message)
      }

      console.log('Role assigned successfully:', role)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authData.user,
        message: 'Team member created successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-team-member function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
