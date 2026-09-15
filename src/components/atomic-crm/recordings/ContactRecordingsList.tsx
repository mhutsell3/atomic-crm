import { useListContext } from "ra-core";
import { Link } from "react-router";
import type { Recording } from "../types";

export const ContactRecordingsList = () => {
  const { data, isPending } = useListContext<Recording>();
  if (isPending || !data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No recordings yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((recording) => (
        <Link
          key={recording.id}
          to={`/recordings/${recording.id}/show`}
          className="text-sm underline"
        >
          {recording.topic} —{" "}
          {new Date(recording.start_time).toLocaleDateString()}
        </Link>
      ))}
    </div>
  );
};
