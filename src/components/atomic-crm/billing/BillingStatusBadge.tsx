import { useRecordContext } from "ra-core";
import { Badge } from "@/components/ui/badge";
import type { Payment, Subscription } from "../types";
import {
  paymentStatusChoices,
  subscriptionStatusChoices,
} from "./billingFormat";

const labelFor = (status: string) =>
  [...paymentStatusChoices, ...subscriptionStatusChoices].find(
    (choice) => choice.id === status,
  )?.name ?? status;

const variantFor = (status: string) => {
  if (status === "SUCCEEDED" || status === "ACTIVE") return "default";
  if (status === "FAILED" || status === "PAST_DUE" || status === "UNPAID")
    return "destructive";
  return "outline";
};

export const BillingStatusBadge = ({ status }: { status?: string }) => {
  const record = useRecordContext<Payment | Subscription>();
  const value = status ?? record?.status;
  if (!value) return null;
  return <Badge variant={variantFor(value)}>{labelFor(value)}</Badge>;
};
