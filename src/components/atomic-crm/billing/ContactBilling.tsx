import { useListContext } from "ra-core";
import { Link } from "react-router";
import type { Payment, Subscription } from "../types";
import { formatMoney, paymentStatusChoices } from "./billingFormat";

export const ContactPaymentsList = () => {
  const { data, isPending } = useListContext<Payment>();
  if (isPending || !data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">No payments yet.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((payment) => (
        <Link
          key={payment.id}
          to={`/payments/${payment.id}/show`}
          className="text-sm underline"
        >
          {formatMoney(payment.amount_cents, payment.currency)} —{" "}
          {payment.paid_at
            ? new Date(payment.paid_at).toLocaleDateString()
            : "not paid"}
          {payment.status !== "SUCCEEDED" &&
            ` (${paymentStatusChoices.find((c) => c.id === payment.status)?.name.toLowerCase()})`}
        </Link>
      ))}
    </div>
  );
};

export const ContactSubscriptionsList = () => {
  const { data, isPending } = useListContext<Subscription>();
  if (isPending || !data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((subscription) => (
        <Link
          key={subscription.id}
          to={`/subscriptions/${subscription.id}/show`}
          className="text-sm underline"
        >
          {subscription.plan_name ?? "Subscription"} —{" "}
          {subscription.status.toLowerCase().replace("_", " ")}
        </Link>
      ))}
    </div>
  );
};
