import { CustomEditor, CustomElement } from "@/components/EditorComponent";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

const insertImage = (src: string, editor: CustomEditor) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", src, children: [text] };
  Transforms.insertNodes(editor, image);
  const type = "paragraph";
  const newBlock: CustomElement = { type, children: [{ text: "" }] };
  Transforms.insertNodes(editor, newBlock);
  ReactEditor.focus(editor);
};

const insertParagraphBlock = (editor: CustomEditor) => {
  const type = "paragraph";
  const paragraphBlock: CustomElement = {
    type,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, paragraphBlock, {
    at: [editor.children.length],
  });
};

export const insertBlock = (
  type:
    | "heading"
    | "paragraph"
    | "code"
    | "image"
    | "lineBreak"
    | "unorderedlist",
  setShowToolbar: React.Dispatch<React.SetStateAction<boolean>>,
  editor: CustomEditor
) => {
  if (type === "image") {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          const url = reader.result;
          if (url) {
            insertImage(url.toString(), editor);
          }
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  } else if (type === "lineBreak") {
    const block = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, block, {
      at: [editor.children.length],
    });
    insertParagraphBlock(editor);
    Transforms.select(editor, Editor.end(editor, []));
  } else {
    const block = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, block);
  }
  console.log(Editor.end(editor, []), "editor end");
  ReactEditor.focus(editor);
  setShowToolbar(false);
};
