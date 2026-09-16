import { useListContext } from "ra-core";
import { Link } from "react-router";
import type { Session } from "../types";

export const ContactSessionsList = () => {
  const { data, isPending } = useListContext<Session>();
  if (isPending || !data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">No sessions yet.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((session) => (
        <Link
          key={session.id}
          to={`/sessions/${session.id}/show`}
          className="text-sm underline"
        >
          {new Date(session.scheduled_at).toLocaleString()} — {session.status}
        </Link>
      ))}
    </div>
  );
};
