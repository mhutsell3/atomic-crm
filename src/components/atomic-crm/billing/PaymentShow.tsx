import { useRecordContext } from "ra-core";
import { DateField } from "@/components/admin/date-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Show } from "@/components/admin/show";
import { TextField } from "@/components/admin/text-field";

import type { Payment } from "../types";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { formatMoney } from "./billingFormat";

const Amount = () => {
  const record = useRecordContext<Payment>();
  return record ? (
    <>{formatMoney(record.amount_cents, record.currency)}</>
  ) : null;
};

export const PaymentShow = () => (
  <Show>
    <div className="flex flex-col gap-4 max-w-2xl">
      <RecordField label="Amount">
        <Amount />
      </RecordField>
      <RecordField label="Status">
        <BillingStatusBadge />
      </RecordField>
      <RecordField source="description" />
      <RecordField source="paid_at" label="Paid at" field={DateField} />
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
      <RecordField source="customer_email" label="Stripe customer email" />
      <RecordField source="stripe_customer_id" label="Stripe customer" />
      <RecordField source="stripe_payment_id" label="Stripe reference" />
    </div>
  </Show>
);
