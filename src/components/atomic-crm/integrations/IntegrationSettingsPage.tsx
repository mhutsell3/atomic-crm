import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCanAccess, useNotify } from "ra-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

import { callIntegrations } from "./integrationsApi";

// What the server returns. Saved secrets are never sent back - only whether one is set.
type IntegrationSettings = {
  twilioAccountSid: string | null;
  twilioFromNumber: string | null;
  smsRemindersEnabled: boolean;
  hasAuthToken: boolean;
  mailgunDomain: string | null;
  mailgunFromAddress: string | null;
  emailRemindersEnabled: boolean;
  hasMailgunApiKey: boolean;
};

const QUERY_KEY = ["integration-settings"];

/**
 * Twilio (SMS) and Mailgun (email) configuration. Configuration only: nothing in the CRM sends a
 * text or an email through these yet. Administrators only - enforced by the server on every
 * request; hiding the page here is just for tidiness.
 */
export const IntegrationSettingsPage = () => {
  const { canAccess, isPending } = useCanAccess({
    resource: "configuration",
    action: "edit",
  });

  if (isPending) return null;
  if (!canAccess) {
    return (
      <div className="max-w-3xl mx-auto mt-16 text-center text-muted-foreground">
        Page not found.
      </div>
    );
  }
  return <IntegrationSettingsForm />;
};

IntegrationSettingsPage.path = "/integrations";

const IntegrationSettingsForm = () => {
  const notify = useNotify();
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery<IntegrationSettings>({
    queryKey: QUERY_KEY,
    queryFn: () => callIntegrations<IntegrationSettings>("/integration-settings"),
    retry: false,
  });

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [accountSid, setAccountSid] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [domain, setDomain] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (!data) return;
    setSmsEnabled(data.smsRemindersEnabled);
    setAccountSid(data.twilioAccountSid ?? "");
    setFromNumber(data.twilioFromNumber ?? "");
    setEmailEnabled(data.emailRemindersEnabled);
    setDomain(data.mailgunDomain ?? "");
    setFromAddress(data.mailgunFromAddress ?? "");
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      callIntegrations<IntegrationSettings>("/integration-settings", {
        method: "PUT",
        body: JSON.stringify({
          smsRemindersEnabled: smsEnabled,
          emailRemindersEnabled: emailEnabled,
          twilioAccountSid: accountSid,
          twilioFromNumber: fromNumber,
          mailgunDomain: domain,
          mailgunFromAddress: fromAddress,
          // Blank = keep the saved secret.
          twilioAuthToken: authToken,
          mailgunApiKey: apiKey,
        }),
      }),
    onSuccess: (saved) => {
      queryClient.setQueryData(QUERY_KEY, saved);
      setAuthToken("");
      setApiKey("");
      notify("Integration settings saved", { type: "success" });
    },
    onError: (err) => {
      notify(err instanceof Error ? err.message : "Failed to save", {
        type: "error",
      });
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate();
  };

  if (isPending) {
    return (
      <div className="flex justify-center mt-16">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-16 text-center text-muted-foreground">
        {error instanceof Error ? error.message : "Couldn’t load settings."}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="max-w-3xl w-full mx-auto mt-8 mb-16 flex flex-col gap-6"
    >
      <p className="text-sm text-muted-foreground">
        Configuration only — no texts or emails are sent through these yet.
        Credentials are encrypted when saved and are never shown again.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>SMS Reminders (Twilio)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id="sms-enabled"
              checked={smsEnabled}
              onCheckedChange={setSmsEnabled}
            />
            <Label htmlFor="sms-enabled">Enable SMS reminders</Label>
          </div>
          <Field label="Account SID" id="twilio-sid">
            <Input
              id="twilio-sid"
              value={accountSid}
              onChange={(e) => setAccountSid(e.target.value)}
              placeholder="AC…"
            />
          </Field>
          <Field label="From number" id="twilio-from">
            <Input
              id="twilio-from"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              placeholder="+15551234567"
            />
          </Field>
          <Field label="Auth token" id="twilio-token">
            <Input
              id="twilio-token"
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              autoComplete="new-password"
              placeholder={
                data.hasAuthToken ? "Set — leave blank to keep it" : ""
              }
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Reminders (Mailgun)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id="email-enabled"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
            <Label htmlFor="email-enabled">Enable email reminders</Label>
          </div>
          <Field label="Domain" id="mailgun-domain">
            <Input
              id="mailgun-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="mg.example.com"
            />
          </Field>
          <Field label="From address" id="mailgun-from">
            <Input
              id="mailgun-from"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              placeholder="reminders@example.com"
            />
          </Field>
          <Field label="API key" id="mailgun-key">
            <Input
              id="mailgun-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="new-password"
              placeholder={
                data.hasMailgunApiKey ? "Set — leave blank to keep it" : ""
              }
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? <Spinner className="size-4" /> : null}
          Save
        </Button>
      </div>
    </form>
  );
};


const Field = ({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);
