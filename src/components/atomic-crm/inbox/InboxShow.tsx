import { useEffect, useState } from "react";
import { useNotify, useRecordContext, useShowContext, useUpdate } from "ra-core";
import { Show } from "@/components/admin/show";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { callIntegrations } from "../integrations/integrationsApi";
import type { Email } from "../types";
import { EmailStatusBadge } from "./EmailStatusBadge";

export const InboxShow = () => (
  <Show>
    <InboxShowContent />
  </Show>
);

const InboxShowContent = () => {
  const record = useRecordContext<Email>();
  const { refetch } = useShowContext<Email>();
  const notify = useNotify();
  const [update] = useUpdate();
  const [draft, setDraft] = useState(record?.draft_content ?? "");
  const [busy, setBusy] = useState<
    null | "save" | "send" | "skip" | "task"
  >(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setDraft(record?.draft_content ?? "");
  }, [record?.id, record?.draft_content]);

  if (!record) return null;

  const isSent = record.status === "SENT";
  const isSkipped = record.status === "SKIPPED";
  const dirty = draft !== (record.draft_content ?? "");
  const errorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Something went wrong";

  const saveDraft = async () => {
    await update(
      "emails",
      { id: record.id, data: { draft_content: draft }, previousData: record },
      { returnPromise: true },
    );
  };

  const handleSave = async () => {
    setBusy("save");
    try {
      await saveDraft();
      notify("Draft saved", { type: "success" });
      refetch();
    } catch (error) {
      notify(errorMessage(error), { type: "error" });
    } finally {
      setBusy(null);
    }
  };

  const handleSend = async () => {
    setConfirmOpen(false);
    setBusy("send");
    try {
      // The server sends the SAVED draft, so persist any edits first.
      if (dirty) await saveDraft();
      await callIntegrations(`/emails/${record.id}/send`, { method: "POST" });
      notify(`Reply sent to ${record.from_email}`, { type: "success" });
    } catch (error) {
      notify(errorMessage(error), { type: "error" });
    } finally {
      setBusy(null);
      refetch();
    }
  };

  const handleSkipToggle = async () => {
    setBusy("skip");
    try {
      await update(
        "emails",
        {
          id: record.id,
          data: {
            status: isSkipped
              ? record.draft_content
                ? "DRAFTED"
                : "PENDING"
              : "SKIPPED",
          },
          previousData: record,
        },
        { returnPromise: true },
      );
      refetch();
    } catch (error) {
      notify(errorMessage(error), { type: "error" });
    } finally {
      setBusy(null);
    }
  };

  const handleCreateTask = async () => {
    setBusy("task");
    try {
      const result = await callIntegrations<{
        notionCreated: boolean;
        crmTaskCreated: boolean;
      }>(`/emails/${record.id}/create-task`, { method: "POST" });
      notify(
        [
          result.notionCreated ? "Task added to Notion" : null,
          result.crmTaskCreated ? "task added to the contact" : null,
        ]
          .filter(Boolean)
          .join(", ") || "Task created",
        { type: "success" },
      );
    } catch (error) {
      notify(errorMessage(error), { type: "error" });
    } finally {
      setBusy(null);
      refetch();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <EmailStatusBadge />
          {record.draft_confidence != null && (
            <span className="text-muted-foreground">
              Draft confidence {Math.round(record.draft_confidence * 100)}%
            </span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground">From: </span>
          {record.from_name ? `${record.from_name} ` : ""}
          &lt;{record.from_email}&gt;
        </div>
        <div>
          <span className="text-muted-foreground">Received: </span>
          {new Date(record.received_at).toLocaleString()}
        </div>
        {record.contact_id ? (
          <div>
            <span className="text-muted-foreground">Contact: </span>
            <ReferenceField
              source="contact_id"
              reference="contacts"
              link="show"
            >
              <TextField source="first_name" />{" "}
              <TextField source="last_name" />
            </ReferenceField>
          </div>
        ) : null}
        {record.sent_at ? (
          <div>
            <span className="text-muted-foreground">Replied: </span>
            {new Date(record.sent_at).toLocaleString()}
          </div>
        ) : null}
      </div>

      <div>
        <h3 className="font-semibold mb-2">{record.subject}</h3>
        <pre className="whitespace-pre-wrap font-sans text-sm max-h-96 overflow-y-auto border rounded-md p-3">
          {record.body_text || "(no plain-text body)"}
        </pre>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Draft reply</h3>
        {!record.draft_content && !isSent ? (
          <p className="text-sm text-muted-foreground mb-2">
            No AI draft was generated for this email. You can write a reply
            here.
          </p>
        ) : null}
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isSent || busy !== null}
          className="min-h-48"
          placeholder="Write a reply…"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={!dirty || isSent || busy !== null}
        >
          {busy === "save" ? <Spinner className="size-4" /> : null}
          Save draft
        </Button>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={isSent || !draft.trim() || busy !== null}
        >
          {busy === "send" ? <Spinner className="size-4" /> : null}
          Send reply…
        </Button>
        <Button
          variant="outline"
          onClick={handleSkipToggle}
          disabled={isSent || busy !== null}
        >
          {isSkipped ? "Restore" : "Skip"}
        </Button>
        <Button
          variant="outline"
          onClick={handleCreateTask}
          disabled={Boolean(record.notion_page_id) || busy !== null}
        >
          {record.notion_page_id ? "Task created" : "Create task"}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send this reply?</DialogTitle>
            <DialogDescription>
              This sends a real email from your Gmail account to{" "}
              {record.from_email}. It can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <pre className="whitespace-pre-wrap font-sans text-sm max-h-64 overflow-y-auto border rounded-md p-3">
            {draft}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend}>Send email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
