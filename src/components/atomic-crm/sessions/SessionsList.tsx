import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";

import { TopToolbar } from "../layout/TopToolbar";

const SessionsListActions = () => (
  <TopToolbar>
    <CreateButton label="Schedule session" />
  </TopToolbar>
);

export const SessionsList = () => (
  <List
    title={false}
    perPage={25}
    sort={{ field: "scheduled_at", order: "DESC" }}
    actions={<SessionsListActions />}
  >
    <DataTable>
      <DataTable.Col label="Client">
        <ReferenceField source="contact_id" reference="contacts" link="show">
          <TextField source="first_name" /> <TextField source="last_name" />
        </ReferenceField>
      </DataTable.Col>
      <DataTable.Col source="scheduled_at" field={DateField} />
      <DataTable.Col source="duration_minutes" label="Duration (min)" />
      <DataTable.Col source="status" />
    </DataTable>
  </List>
);
