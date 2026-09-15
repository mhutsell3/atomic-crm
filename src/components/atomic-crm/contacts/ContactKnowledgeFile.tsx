import { useState } from "react";
import { useGetList, useRecordContext } from "ra-core";
import { Button } from "@/components/ui/button";
import type { ClientKnowledgeFile, Contact } from "../types";
import { ContactKnowledgeFileEditSheet } from "./ContactKnowledgeFileEditSheet";

export const ContactKnowledgeFile = () => {
  const record = useRecordContext<Contact>();
  const [open, setOpen] = useState(false);

  const { data, isPending } = useGetList<ClientKnowledgeFile>(
    "client_knowledge_files",
    {
      filter: { contact_id: record?.id },
      pagination: { page: 1, perPage: 1 },
    },
    { enabled: !!record },
  );

  if (!record) return null;

  const knowledgeFile = data?.[0];

  return (
    <div>
      {isPending ? null : knowledgeFile?.content ? (
        <p className="text-sm whitespace-pre-wrap pb-2 line-clamp-6">
          {knowledgeFile.content}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground pb-2">No notes yet.</p>
      )}
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {knowledgeFile?.content ? "Edit notes" : "Add notes"}
      </Button>
      <ContactKnowledgeFileEditSheet
        open={open}
        onOpenChange={setOpen}
        contactId={record.id}
        knowledgeFile={knowledgeFile}
      />
    </div>
  );
};
