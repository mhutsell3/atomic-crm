-- is_admin() is SECURITY DEFINER, so it runs as the function's owner. On a self-hosted stack that
-- owner (the role that applied the schema) has no USAGE on the `auth` schema, so calling
-- auth.uid() inside it failed with `permission denied for schema auth` - and because the
-- configuration table's write policies call is_admin(), Settings could never be saved.
-- Read the caller's id from the JWT claims PostgREST sets instead; it is what auth.uid() reads.

CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  return exists (
    select 1 from public.sales
    where user_id = (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
      and administrator = true
  );
end;
$$;
