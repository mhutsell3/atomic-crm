import type { Payment, Subscription } from "../types";
import { BillingEdit } from "./BillingEdit";
import { formatMoney } from "./billingFormat";
import { PaymentShow } from "./PaymentShow";
import { PaymentsList } from "./PaymentsList";
import { SubscriptionShow } from "./SubscriptionShow";
import { SubscriptionsList } from "./SubscriptionsList";

// Payments and subscriptions are only ever created by the Stripe webhook, so there is no create
// or delete - the edit page just lets you assign a record to a client.
export const payments = {
  list: PaymentsList,
  show: PaymentShow,
  edit: BillingEdit,
  recordRepresentation: (record: Payment) =>
    formatMoney(record?.amount_cents, record?.currency ?? "usd"),
};

export const subscriptions = {
  list: SubscriptionsList,
  show: SubscriptionShow,
  edit: BillingEdit,
  recordRepresentation: (record: Subscription) =>
    record?.plan_name ?? "Subscription",
};
