import { supabase } from "./supabaseClient";

/**
 * EML AUTH & IDENTITY SYSTEM - V2.0
 * Hardened for Enterprise Machinery Transactions.
 */

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return { data: null, error };

  // SMART FEATURE: Fetch profile immediately to populate AI context
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, trust_score, is_admin')
    .eq('id', data.user.id)
    .single();

  return { 
    user: data.user, 
    profile: profile || null, 
    error: null 
  };
};

export const signUp = async (email: string, password: string, fullName: string, phone: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        // Default trust score for new users in a world-class system
        initial_trust: 50 
      },
    },
  });
};

/**
 * Validates if the current session belongs to an authorized role.
 * Prevents unauthorized API access.
 */
export const checkAccess = async (requiredRoles: string[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile && requiredRoles.includes(profile.role);
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};