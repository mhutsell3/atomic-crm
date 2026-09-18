import type { Email } from "../types";
import { InboxList } from "./InboxList";
import { InboxShow } from "./InboxShow";

export default {
  list: InboxList,
  show: InboxShow,
  recordRepresentation: (record: Email) => record?.subject,
};
