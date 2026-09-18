import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetOne, useNotify, useUpdate } from "ra-core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { callIntegrations } from "../integrations/integrationsApi";
import type { EmailAgentConfig } from "../types";

type IntegrationStatus = { gmail: boolean; ai: boolean; notion: boolean };

export const EmailSettingsPage = () => {
  const notify = useNotify();
  const [update] = useUpdate();
  const { data: config, refetch } = useGetOne<EmailAgentConfig>(
    "email_agent_config",
    { id: 1 },
  );
  const { data: status, isPending: statusPending } =
    useQuery<IntegrationStatus>({
      queryKey: ["email-integration-status"],
      queryFn: () => callIntegrations<IntegrationStatus>("/email-settings/status"),
      retry: false,
    });

  const [masterPrompt, setMasterPrompt] = useState("");
  const [routingRules, setRoutingRules] = useState("");
  const [styleGuide, setStyleGuide] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;
    setMasterPrompt(config.master_prompt);
    setRoutingRules(config.routing_rules);
    setStyleGuide(config.style_guide);
  }, [config]);

  const dirty =
    !!config &&
    (masterPrompt !== config.master_prompt ||
      routingRules !== config.routing_rules ||
      styleGuide !== config.style_guide);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await update(
        "email_agent_config",
        {
          id: 1,
          data: {
            master_prompt: masterPrompt,
            routing_rules: routingRules,
            style_guide: styleGuide,
          },
          previousData: config,
        },
        { returnPromise: true },
      );
      notify("Email agent settings saved", { type: "success" });
      refetch();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Failed to save", {
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto mt-8 mb-16 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email agent</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            Incoming Gmail is triaged and a reply is drafted by your local AI
            model. Nothing is ever sent without you reviewing and clicking
            send.
          </p>

          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Connections:</span>
            {statusPending ? (
              <Spinner className="size-4" />
            ) : status ? (
              <>
                <StatusBadge label="Gmail" ok={status.gmail} />
                <StatusBadge label="Local AI (Ollama)" ok={status.ai} />
                <StatusBadge label="Notion" ok={status.notion} />
              </>
            ) : (
              <span className="text-muted-foreground">
                Couldn’t reach the integrations server.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="master-prompt">Master prompt</Label>
            <Textarea
              id="master-prompt"
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              className="min-h-32"
              placeholder="Leave blank to use the built-in default instructions."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="routing-rules">Routing rules</Label>
            <Textarea
              id="routing-rules"
              value={routingRules}
              onChange={(e) => setRoutingRules(e.target.value)}
              className="min-h-24"
              placeholder="Notes about which kinds of email need what kind of reply."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="style-guide">Style guide and examples</Label>
            <Textarea
              id="style-guide"
              value={styleGuide}
              onChange={(e) => setStyleGuide(e.target.value)}
              className="min-h-48"
              placeholder="How you write: tone, phrasing, sample replies."
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!dirty || saving}>
              {saving ? <Spinner className="size-4" /> : null}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

EmailSettingsPage.path = "/email-settings";

const StatusBadge = ({ label, ok }: { label: string; ok: boolean }) => (
  <Badge variant={ok ? "default" : "outline"}>
    {label}: {ok ? "connected" : "not available"}
  </Badge>
);
