-- cleanup_note_attachments() asks the delete_note_attachments edge function (through the pg_net
-- extension) to remove storage files when a note's attachments change or the note is deleted.
-- Where pg_net is not installed (e.g. self-hosting on a stock Postgres) that call raised
-- `schema "net" does not exist`, which aborted the whole statement - so deleting a note failed.
-- Storage cleanup is a nicety: make it best-effort so it can never block the user's save/delete.

CREATE OR REPLACE FUNCTION "public"."cleanup_note_attachments"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
    DECLARE
      payload jsonb;
      request_headers jsonb;
      auth_header text;
    BEGIN
      request_headers := coalesce(
        nullif(current_setting('request.headers', true), '')::jsonb,
        '{}'::jsonb
      );
      auth_header := request_headers ->> 'authorization';

      IF auth_header IS NULL OR auth_header = '' THEN
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        END IF;

        RETURN NEW;
      END IF;

      payload := jsonb_build_object(
        'old_record', OLD,
        'record', NEW,
        'type', TG_OP
      );

      BEGIN
        PERFORM net.http_post(
          url := public.get_note_attachments_function_url(),
          body := payload,
          params := '{}'::jsonb,
          headers := jsonb_build_object(
            'Content-Type',
            'application/json',
            'Authorization',
            auth_header
          ),
          timeout_milliseconds := 10000
        );
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'cleanup_note_attachments: storage cleanup skipped (%)', SQLERRM;
      END;

      IF TG_OP = 'DELETE' THEN
        RETURN OLD;
      END IF;

      RETURN NEW;
    END;
    $$;
