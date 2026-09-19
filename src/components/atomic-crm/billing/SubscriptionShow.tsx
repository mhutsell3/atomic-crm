import { useRecordContext } from "ra-core";
import { DateField } from "@/components/admin/date-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Show } from "@/components/admin/show";
import { TextField } from "@/components/admin/text-field";

import type { Subscription } from "../types";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { formatMoney } from "./billingFormat";

const Price = () => {
  const record = useRecordContext<Subscription>();
  return record ? (
    <>{formatMoney(record.amount_cents, record.currency)}</>
  ) : null;
};

export const SubscriptionShow = () => (
  <Show>
    <div className="flex flex-col gap-4 max-w-2xl">
      <RecordField label="Client">
        <ReferenceField
          source="contact_id"
          reference="contacts"
          link="show"
          empty="Unassigned"
        >
          <TextField source="first_name" /> <TextField source="last_name" />
        </ReferenceField>
      </RecordField>
      <RecordField source="plan_name" label="Plan" />
      <RecordField label="Price">
        <Price />
      </RecordField>
      <RecordField label="Status">
        <BillingStatusBadge />
      </RecordField>
      <RecordField
        source="current_period_start"
        label="Current period start"
        field={DateField}
      />
      <RecordField
        source="current_period_end"
        label="Current period end"
        field={DateField}
      />
      <RecordField source="canceled_at" label="Canceled at" field={DateField} />
      <RecordField source="customer_email" label="Stripe customer email" />
      <RecordField source="stripe_customer_id" label="Stripe customer" />
      <RecordField source="stripe_subscription_id" label="Stripe reference" />
    </div>
  </Show>
);
