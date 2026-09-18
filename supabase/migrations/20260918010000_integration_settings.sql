-- Twilio (SMS) and Mailgun (email) integration settings. Configuration only - nothing sends yet.
--
-- Secrets (auth token / API key) are stored AES-256-GCM encrypted by the integrations server.
-- This table is deliberately NOT exposed to PostgREST: RLS is on with no policies and all API
-- roles are revoked, so browsers can never read it (not even the ciphertext). Only the
-- integrations server (theosyn_integration, bypassrls) reads/writes it, behind an admin check.

create table public.integration_settings (
    id integer not null default 1 primary key,
    twilio_account_sid text,
    twilio_auth_token_cipher text,
    twilio_from_number text,
    sms_reminders_enabled boolean not null default false,
    mailgun_api_key_cipher text,
    mailgun_domain text,
    mailgun_from_address text,
    email_reminders_enabled boolean not null default false,
    updated_at timestamp with time zone not null default now(),
    constraint integration_settings_singleton check (id = 1)
);

insert into public.integration_settings (id) values (1);

create or replace trigger set_integration_settings_updated_at
    before update on public.integration_settings
    for each row execute function public.set_updated_at();

alter table public.integration_settings enable row level security;

revoke all on table public.integration_settings from public;
revoke all on table public.integration_settings from anon;
revoke all on table public.integration_settings from authenticated;
revoke all on table public.integration_settings from service_role;
