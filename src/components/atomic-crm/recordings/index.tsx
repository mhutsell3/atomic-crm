import type { Recording } from "../types";
import { RecordingsList } from "./RecordingsList";
import { RecordingShow } from "./RecordingShow";
import { RecordingEdit } from "./RecordingEdit";

export default {
  list: RecordingsList,
  show: RecordingShow,
  edit: RecordingEdit,
  recordRepresentation: (record: Recording) => record?.topic,
};
