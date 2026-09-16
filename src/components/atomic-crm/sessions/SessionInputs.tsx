import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

const statusChoices = [
  { id: "SCHEDULED", name: "Scheduled" },
  { id: "COMPLETED", name: "Completed" },
  { id: "CANCELED", name: "Canceled" },
  { id: "NO_SHOW", name: "No-show" },
];

export const SessionInputs = () => (
  <div className="flex flex-col gap-4">
    <ReferenceInput source="contact_id" reference="contacts" perPage={100}>
      <AutocompleteInput
        label="Client"
        optionText={(record) =>
          record ? `${record.first_name} ${record.last_name}` : ""
        }
      />
    </ReferenceInput>
    <DateTimeInput source="scheduled_at" label="Scheduled at" />
    <NumberInput source="duration_minutes" label="Duration (minutes)" defaultValue={60} />
    <SelectInput source="status" choices={statusChoices} defaultValue="SCHEDULED" />
    <TextInput source="notes" multiline />
  </div>
);
