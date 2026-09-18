import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { SelectInput } from "@/components/admin/select-input";
import { TextField } from "@/components/admin/text-field";

import type { Email } from "../types";
import { EmailStatusBadge, statusChoices } from "./EmailStatusBadge";

const filters = [
  <SelectInput
    source="status"
    label={false}
    emptyText="All statuses"
    choices={statusChoices}
    alwaysOn
  />,
];

export const InboxList = () => (
  <List
    title={false}
    perPage={25}
    sort={{ field: "received_at", order: "DESC" }}
    filters={filters}
    actions={false}
  >
    <DataTable>
      <DataTable.Col
        source="received_at"
        label="Received"
        field={ReceivedField}
      />
      <DataTable.Col
        label="From"
        render={(record: Email) => record.from_name || record.from_email}
      />
      <DataTable.Col source="subject" />
      <DataTable.Col label="Status">
        <EmailStatusBadge />
      </DataTable.Col>
      <DataTable.Col
        label="Confidence"
        render={(record: Email) =>
          record.draft_confidence != null
            ? `${Math.round(record.draft_confidence * 100)}%`
            : ""
        }
      />
      <DataTable.Col label="Contact">
        <ReferenceField source="contact_id" reference="contacts" link="show">
          <TextField source="first_name" /> <TextField source="last_name" />
        </ReferenceField>
      </DataTable.Col>
    </DataTable>
  </List>
);

const ReceivedField = ({ source }: { source: string }) => (
  <DateField source={source} showTime />
);
