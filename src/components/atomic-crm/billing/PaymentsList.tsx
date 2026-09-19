import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { SelectInput } from "@/components/admin/select-input";
import { TextField } from "@/components/admin/text-field";

import { ActiveFilterButton } from "../misc/ActiveFilterButton";
import type { Payment } from "../types";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { formatMoney, paymentStatusChoices } from "./billingFormat";

const filters = [
  <SelectInput
    source="status"
    label={false}
    emptyText="All statuses"
    choices={paymentStatusChoices}
    alwaysOn
  />,
];

export const PaymentsList = () => (
  <List
    title={false}
    perPage={25}
    sort={{ field: "paid_at", order: "DESC" }}
    filters={filters}
    actions={false}
  >
    <div className="mb-2">
      <ActiveFilterButton
        label="Unassigned only"
        value={{ contact_id: null }}
      />
    </div>
    <DataTable>
      <DataTable.Col source="paid_at" label="Paid" field={DateField} />
      <DataTable.Col
        label="Amount"
        render={(record: Payment) =>
          formatMoney(record.amount_cents, record.currency)
        }
      />
      <DataTable.Col label="Status">
        <BillingStatusBadge />
      </DataTable.Col>
      <DataTable.Col source="description" />
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
      <DataTable.Col source="customer_email" label="Stripe email" />
    </DataTable>
  </List>
);
