-- set_sales_id_default() runs as whichever role does the insert. On a self-hosted stack the
-- integrations server's login role has no USAGE on the `auth` schema, so calling auth.uid() made
-- every insert from it (e.g. the Zoom/Stripe activity-log rows) fail with `permission denied for
-- schema auth`. Read the caller's id from the JWT claims PostgREST sets instead - it is what
-- auth.uid() reads, and it is simply absent for direct database connections (sales_id stays null).

CREATE OR REPLACE FUNCTION "public"."set_sales_id_default"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF NEW.sales_id IS NULL THEN
    SELECT id INTO NEW.sales_id FROM sales
    WHERE user_id = (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
  END IF;
  RETURN NEW;
END;
$$;
