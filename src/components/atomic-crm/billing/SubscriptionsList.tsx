import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { SelectInput } from "@/components/admin/select-input";
import { TextField } from "@/components/admin/text-field";

import { ActiveFilterButton } from "../misc/ActiveFilterButton";
import type { Subscription } from "../types";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { formatMoney, subscriptionStatusChoices } from "./billingFormat";

const filters = [
  <SelectInput
    source="status"
    label={false}
    emptyText="All statuses"
    choices={subscriptionStatusChoices}
    alwaysOn
  />,
];

export const SubscriptionsList = () => (
  <List
    title={false}
    perPage={25}
    sort={{ field: "created_at", order: "DESC" }}
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
      <DataTable.Col source="plan_name" label="Plan" />
      <DataTable.Col
        label="Price"
        render={(record: Subscription) =>
          formatMoney(record.amount_cents, record.currency)
        }
      />
      <DataTable.Col label="Status">
        <BillingStatusBadge />
      </DataTable.Col>
      <DataTable.Col
        source="current_period_end"
        label="Renews / ends"
        field={DateField}
      />
      <DataTable.Col source="customer_email" label="Stripe email" />
    </DataTable>
  </List>
);
