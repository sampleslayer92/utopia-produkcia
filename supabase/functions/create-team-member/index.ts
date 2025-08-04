
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
    const { first_name, last_name, email, phone, password, role, team_id } = body

    console.log('Creating user with data:', { first_name, last_name, email, role })

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    let userData = null;
    
    if (existingUser && !existingUserError) {
      console.log('User already exists, updating role and profile...')
      userData = existingUser.user;
      
      // Update existing user's role
      const { error: deleteRoleError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userData.id)
      
      if (deleteRoleError) {
        console.log('Note: Could not delete existing role:', deleteRoleError.message)
      }
      
      // Insert new role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role
        })
      
      if (roleError) {
        console.error('Role assignment error:', roleError)
        throw new Error('Failed to assign role: ' + roleError.message)
      }
      
      console.log('Role updated successfully:', role)
      
    } else {
      // Create new user
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
      
      userData = authData.user;
      console.log('New user created in auth:', userData?.id)
    }

    // Update profile with phone number and team_id if provided (for both new and existing users)
    if (userData && (phone || team_id)) {
      const updateData: any = {};
      if (phone) updateData.phone = phone;
      if (team_id) updateData.team_id = team_id;

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userData.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      } else {
        console.log('Profile updated successfully with:', updateData)
      }
    }

    // Assign role only for new users (existing users already had role updated above)
    if (!existingUser && userData) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role
        })

      if (roleError) {
        console.error('Role assignment error:', roleError)
        throw new Error('Failed to assign role: ' + roleError.message)
      }

      console.log('Role assigned successfully:', role)
    }

    // If creating/updating a merchant user, update the merchant record with user connection
    if (userData && role === 'merchant') {
      console.log('Connecting merchant account to user:', userData.email)
      
      const { error: merchantUpdateError } = await supabaseAdmin
        .from('merchants')
        .update({ 
          contact_person_email: userData.email 
        })
        .eq('contact_person_email', userData.email)

      if (merchantUpdateError) {
        console.error('Error connecting merchant to user:', merchantUpdateError)
        // Don't throw error here as user creation was successful
      } else {
        console.log('Merchant record connected to user successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData,
        message: existingUser ? 'User role updated successfully' : 'Team member created successfully',
        isExistingUser: !!existingUser
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
