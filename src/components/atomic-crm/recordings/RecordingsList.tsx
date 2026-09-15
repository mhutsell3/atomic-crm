import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";

import { ActiveFilterButton } from "../misc/ActiveFilterButton";

export const RecordingsList = () => {
  return (
    <List
      title={false}
      perPage={25}
      sort={{ field: "start_time", order: "DESC" }}
      filterDefaultValues={{ contact_id: null }}
      actions={false}
    >
      <div className="mb-2">
        <ActiveFilterButton
          label="Unassigned only"
          value={{ contact_id: null }}
        />
      </div>
      <DataTable>
        <DataTable.Col source="topic" />
        <DataTable.Col source="start_time" field={DateField} />
        <DataTable.Col source="duration_minutes" label="Duration (min)" />
        <DataTable.Col label="Client">
          <ReferenceField
            source="contact_id"
            reference="contacts"
            link="show"
            empty="Unassigned"
          >
            <TextField source="first_name" /> <TextField source="last_name" />
          </ReferenceField>
        </DataTable.Col>
      </DataTable>
    </List>
  );
};
