import { useGetIdentity } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { RelativeDate } from "../misc/RelativeDate";
import { useGetSalesName } from "../sales/useGetSalesName";
import type { ActivityClientActivityCreated } from "../types";
import { ActivityLogNote } from "./ActivityLogNote";

type ActivityLogClientActivityProps = {
  activity: ActivityClientActivityCreated;
};

export function ActivityLogClientActivity({
  activity,
}: ActivityLogClientActivityProps) {
  const { identity } = useGetIdentity();
  const { client_activity } = activity;
  const isCurrentUser = activity.sales_id === identity?.id;
  const salesName = useGetSalesName(activity.sales_id, {
    enabled: !isCurrentUser,
  });
  const link = client_activity.contact_id
    ? `/contacts/${client_activity.contact_id}/show`
    : false;

  return (
    <ActivityLogNote
      header={
        <div className="flex items-start gap-2 w-full">
          <span className="text-muted-foreground text-sm flex-grow">
            {salesName ? `${salesName} — ` : null}
            {client_activity.contact_id ? (
              <ReferenceField
                source="contact_id"
                reference="contacts"
                record={client_activity}
              >
                <TextField source="first_name" />{" "}
                <TextField source="last_name" />
              </ReferenceField>
            ) : null}{" "}
            <RelativeDate date={activity.date} />
          </span>
        </div>
      }
      text={client_activity.description}
      link={link}
    />
  );
}
