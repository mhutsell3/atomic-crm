import { useEffect, useState } from "react";
import type { Identifier } from "ra-core";
import { useCreate, useNotify, useUpdate } from "ra-core";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ClientKnowledgeFile } from "../types";

export interface ContactKnowledgeFileEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: Identifier;
  knowledgeFile?: ClientKnowledgeFile;
}

export const ContactKnowledgeFileEditSheet = ({
  open,
  onOpenChange,
  contactId,
  knowledgeFile,
}: ContactKnowledgeFileEditSheetProps) => {
  const [content, setContent] = useState(knowledgeFile?.content ?? "");
  const [isPending, setIsPending] = useState(false);
  const notify = useNotify();
  const [create] = useCreate();
  const [update] = useUpdate();

  // Re-sync local draft whenever the sheet is (re)opened against the latest record.
  useEffect(() => {
    if (open) {
      setContent(knowledgeFile?.content ?? "");
    }
  }, [open, knowledgeFile?.content]);

  const handleSave = async () => {
    setIsPending(true);
    try {
      if (knowledgeFile) {
        await update(
          "client_knowledge_files",
          {
            id: knowledgeFile.id,
            data: { content },
            previousData: knowledgeFile,
          },
          { returnPromise: true },
        );
      } else {
        await create(
          "client_knowledge_files",
          { data: { contact_id: contactId, content } },
          { returnPromise: true },
        );
      }
      notify("Notes saved", { type: "success" });
      onOpenChange(false);
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Failed to save notes",
        { type: "error" },
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-dvh flex flex-col"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Client notes</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-full"
            placeholder="Coaching notes, background, goals..."
            autoFocus
          />
        </div>
        <SheetFooter className="border-t flex flex-row w-full gap-4">
          <Button
            className="flex-1 h-12"
            onClick={handleSave}
            disabled={isPending}
          >
            Save
            {isPending ? <Spinner className="size-4" /> : null}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
