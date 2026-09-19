// Based on https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/_shared/jwt/default.ts
import * as jose from "jsr:@panva/jose@6";
import { createClient, type User } from "jsr:@supabase/supabase-js@2";
import { createErrorResponse } from "./utils.ts";

const SUPABASE_JWT_ISSUER =
  Deno.env.get("SB_JWT_ISSUER") ?? Deno.env.get("SUPABASE_URL") + "/auth/v1";

// Self-hosted Supabase Auth signs tokens with a shared HS256 secret and has no JWKS to fetch
// (the hosted/CLI stack uses asymmetric keys). When SB_JWT_SECRET is set we verify against it.
const SUPABASE_JWT_SECRET = Deno.env.get("SB_JWT_SECRET");

const SUPABASE_JWT_KEYS = SUPABASE_JWT_SECRET
  ? undefined
  : jose.createRemoteJWKSet(
      new URL(Deno.env.get("SUPABASE_URL")! + "/auth/v1/.well-known/jwks.json"),
    );

function getAuthToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    throw new Error(`Auth header is not 'Bearer {token}'`);
  }

  return token;
}

async function verifySupabaseJWT(jwt: string) {
  if (SUPABASE_JWT_SECRET) {
    const result = await jose.jwtVerify(
      jwt,
      new TextEncoder().encode(SUPABASE_JWT_SECRET),
      { algorithms: ["HS256"] },
    );
    // The project's public anon/service_role API keys are signed with the same secret. Only a
    // signed-in user's session token may call these functions.
    if (result.payload.role !== "authenticated") {
      throw new Error("Not a user session token");
    }
    return result;
  }

  return jose.jwtVerify(jwt, SUPABASE_JWT_KEYS!, {
    issuer: SUPABASE_JWT_ISSUER,
  });
}

/**
 * Validates the Authorization header to ensure that a user is authenticated.
 */
export const AuthMiddleware = async (
  req: Request,
  next: (req: Request) => Promise<Response>,
) => {
  if (req.method === "OPTIONS") return await next(req);

  try {
    const token = getAuthToken(req);
    const isValidJWT = await verifySupabaseJWT(token);

    if (isValidJWT) return await next(req);

    return createErrorResponse(401, "Invalid authentication");
  } catch (e) {
    return createErrorResponse(401, e?.toString() || "Unauthorized");
  }
};

/**
 * Get the authenticated user using the authorization header.
 * User will be undefined for OPTIONS requests.
 */
export const UserMiddleware = async (
  req: Request,
  next: (req: Request, user?: User) => Promise<Response>,
) => {
  if (req.method === "OPTIONS") return await next(req);

  try {
    const authHeader = req.headers.get("Authorization")!;
    const localClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SB_PUBLISHABLE_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data, error: authError } = await localClient.auth.getUser();
    if (!data?.user || authError) {
      return createErrorResponse(401, "Unauthorized");
    }

    return next(req, data.user);
  } catch (err) {
    return createErrorResponse(401, err?.toString() || "Unauthorized");
  }
};
