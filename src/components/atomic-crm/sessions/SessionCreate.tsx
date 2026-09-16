import { Create } from "@/components/admin/create";
import { SimpleForm } from "@/components/admin/simple-form";
import { SessionInputs } from "./SessionInputs";

export const SessionCreate = () => (
  <Create>
    <SimpleForm>
      <SessionInputs />
    </SimpleForm>
  </Create>
);
