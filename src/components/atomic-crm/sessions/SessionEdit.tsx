import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { SessionInputs } from "./SessionInputs";

export const SessionEdit = () => (
  <Edit>
    <SimpleForm>
      <SessionInputs />
    </SimpleForm>
  </Edit>
);
