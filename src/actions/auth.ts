"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Helper to log MFA events
async function logMfaEvent(userId: string, action: string, status: 'success' | 'failure', details?: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('mfa_audit_logs').insert({
    user_id: userId,
    action: action,
    status: status,
    details: details,
    timestamp: new Date().toISOString(),
  });
  if (error) {
    console.error('Failed to log MFA event:', error);
  }
}


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Check for MFA factors
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (user && user.factors && user.factors.length > 0) {
    // User has MFA enabled, redirect to MFA verification page
    return redirect("/mfa-verify");
  }

  return redirect("/protected");
};

export const mfaChallengeAction = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.challenge({
    factorRef: "totp", // Assuming TOTP as the primary MFA factor
  });

  if (error) {
    console.error("MFA Challenge Error:", error);
    return { error: error.message };
  }

  return { challengeId: data.id };
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const mfaEnrollAction = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });

  if (error) {
    console.error("MFA Enroll Error:", error);
    await logMfaEvent(user.id, 'mfa_enroll', 'failure', { error: error.message });
    return { error: error.message };
  }

  await logMfaEvent(user.id, 'mfa_enroll', 'success', { factorId: data.id });
  return { qrCode: data.qrCode, factorId: data.id };
};

export const mfaVerifyAction = async (factorId: string, code: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });

  if (error) {
    console.error("MFA Verify Error:", error);
    await logMfaEvent(user.id, 'mfa_verify', 'failure', { factorId, code, error: error.message });
    return { error: error.message };
  }

  await logMfaEvent(user.id, 'mfa_verify', 'success', { factorId });
  return { success: true };
};

export const mfaDisableAction = async (factorId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({
    factorId,
  });

  if (error) {
    console.error("MFA Disable Error:", error);
    await logMfaEvent(user.id, 'mfa_disable', 'failure', { factorId, error: error.message });
    return { error: error.message };
  }

  await logMfaEvent(user.id, 'mfa_disable', 'success', { factorId });
  return { success: true };
};
