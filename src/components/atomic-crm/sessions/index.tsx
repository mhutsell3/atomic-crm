import type { Session } from "../types";
import { SessionsList } from "./SessionsList";
import { SessionShow } from "./SessionShow";
import { SessionEdit } from "./SessionEdit";
import { SessionCreate } from "./SessionCreate";

export default {
  list: SessionsList,
  show: SessionShow,
  edit: SessionEdit,
  create: SessionCreate,
  recordRepresentation: (record: Session) =>
    record ? new Date(record.scheduled_at).toLocaleString() : "",
};
