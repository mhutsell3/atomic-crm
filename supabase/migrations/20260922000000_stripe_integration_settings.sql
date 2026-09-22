-- Stripe credentials move into integration_settings (encrypted, same as Twilio/Mailgun) so they can
-- be set from the Integration Settings page instead of the integrations server's .env file. This
-- table is already RLS-locked with no policies and revoked from every API role (see
-- 20260918010000_integration_settings.sql), so no policy/grant changes are needed here.

alter table public.integration_settings
    add column stripe_secret_key_cipher text,
    add column stripe_webhook_secret_cipher text;
