import { useRecordContext } from "ra-core";
import { Badge } from "@/components/ui/badge";
import type { Email, EmailStatus } from "../types";

export const statusChoices: { id: EmailStatus; name: string }[] = [
  { id: "DRAFTED", name: "Drafted" },
  { id: "PENDING", name: "Pending (no draft)" },
  { id: "APPROVED", name: "Approved" },
  { id: "SENT", name: "Sent" },
  { id: "SKIPPED", name: "Skipped" },
];

export const EmailStatusBadge = ({ status }: { status?: EmailStatus }) => {
  const record = useRecordContext<Email>();
  const value = status ?? record?.status;
  if (!value) return null;

  const label = statusChoices.find((c) => c.id === value)?.name ?? value;
  return (
    <Badge variant={value === "SENT" ? "default" : "outline"}>{label}</Badge>
  );
};
