import { Show } from "@/components/admin/show";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";

export const SessionShow = () => (
  <Show>
    <div className="flex flex-col gap-4 max-w-2xl">
      <RecordField label="Client">
        <ReferenceField source="contact_id" reference="contacts" link="show">
          <TextField source="first_name" /> <TextField source="last_name" />
        </ReferenceField>
      </RecordField>
      <RecordField source="scheduled_at" label="Scheduled at" field={DateField} />
      <RecordField source="duration_minutes" label="Duration (minutes)" />
      <RecordField source="status" />
      <RecordField source="notes" />
    </div>
  </Show>
);
