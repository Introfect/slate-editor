import { CustomEditor } from "@/components/EditorComponent";
import { Editor } from "slate";

export const isListActive = (editor: CustomEditor, listType: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => typeof n === "object" && "type" in n && n.type === listType,
  });
  return !!match;
};
