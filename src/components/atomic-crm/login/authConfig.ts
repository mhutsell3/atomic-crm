export const disableEmailPasswordAuthentication =
  import.meta.env.VITE_DISABLE_EMAIL_PASSWORD_AUTHENTICATION === "true";

export const googleWorkplaceDomain: string | undefined = import.meta.env
  .VITE_GOOGLE_WORKPLACE_DOMAIN;

// Shows a "Sign in with Google" button (plain OAuth through the self-hosted Supabase Auth).
// Read at build time like the flags above - see GoogleOAuthButton.tsx.
export const enableGoogleOAuth: boolean =
  import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === "true";
