import { getSupabaseClient } from "../providers/supabase/supabase";

// The integrations server (Gmail sync, Zoom, email sending, Twilio/Mailgun settings) is a separate
// service from PostgREST. Calls to it are authenticated with the user's own Supabase login token.
const BASE_URL = (
  import.meta.env.VITE_INTEGRATIONS_URL ?? "https://crm.theosynlabs.com"
).replace(/\/$/, "");

export class IntegrationsApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function callIntegrations<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { data } = await getSupabaseClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new IntegrationsApiError("You are signed out.", 401);
  }

  const response = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new IntegrationsApiError(
      typeof body?.error === "string"
        ? body.error
        : `Request failed (${response.status})`,
      response.status,
    );
  }
  return body as T;
}
