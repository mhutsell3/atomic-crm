import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Edit } from "@/components/admin/edit";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SimpleForm } from "@/components/admin/simple-form";

// Stripe's amounts and status can't be edited here (the database enforces it) - the only change
// a signed-in user can make to a payment or subscription is which client it belongs to.
export const BillingEdit = () => (
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
