import { Show } from "@/components/admin/show";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";
import { useRecordContext } from "ra-core";
import type { Recording } from "../types";

export const RecordingShow = () => (
  <Show>
    <div className="flex flex-col gap-4 max-w-2xl">
      <RecordField source="topic" />
      <RecordField source="start_time" field={DateField} />
      <RecordField source="duration_minutes" label="Duration (minutes)" />
      <RecordField label="Client">
        <ReferenceField
          source="contact_id"
          reference="contacts"
          link="show"
          empty="Unassigned"
        >
          <TextField source="first_name" /> <TextField source="last_name" />
        </ReferenceField>
      </RecordField>
      <RecordingLinks />
      <RecordField source="summary" />
      <RecordField source="transcript">
        <TranscriptField />
      </RecordField>
    </div>
  </Show>
);

const RecordingLinks = () => {
  const record = useRecordContext<Recording>();
  if (!record?.play_url && !record?.download_url) return null;
  return (
    <div className="flex gap-4 text-sm">
      {record.play_url && (
        <a
          href={record.play_url}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Play recording
        </a>
      )}
      {record.download_url && (
        <a
          href={record.download_url}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Download
        </a>
      )}
    </div>
  );
};

const TranscriptField = () => {
  const record = useRecordContext<Recording>();
  if (!record?.transcript) return <span className="text-muted-foreground">No transcript available.</span>;
  return (
    <p className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
      {record.transcript}
    </p>
  );
};
