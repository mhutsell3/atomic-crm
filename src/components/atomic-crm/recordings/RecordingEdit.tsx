import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

export const RecordingEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="contact_id" reference="contacts" perPage={100}>
        <AutocompleteInput
          label="Client"
          optionText={(record) =>
            record ? `${record.first_name} ${record.last_name}` : ""
          }
        />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
