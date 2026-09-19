import type { PaymentStatus, SubscriptionStatus } from "../types";

export const formatMoney = (
  cents: number | null | undefined,
  currency: string,
) =>
  cents == null
    ? ""
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(cents / 100);

export const paymentStatusChoices: { id: PaymentStatus; name: string }[] = [
  { id: "SUCCEEDED", name: "Succeeded" },
  { id: "FAILED", name: "Failed" },
  { id: "REFUNDED", name: "Refunded" },
];

export const subscriptionStatusChoices: {
  id: SubscriptionStatus;
  name: string;
}[] = [
  { id: "ACTIVE", name: "Active" },
  { id: "TRIALING", name: "Trialing" },
  { id: "PAST_DUE", name: "Past due" },
  { id: "UNPAID", name: "Unpaid" },
  { id: "CANCELED", name: "Canceled" },
];
