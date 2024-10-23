import { Editor, Location, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CustomEditor, CustomElement } from "./types";

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

const insertImage = (src: string, editor: CustomEditor) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", src, children: [text] };
  Transforms.insertNodes(editor, image);
  insertParagraphBlock(editor);
  ReactEditor.focus(editor);
};

export const insertBlock = ({
  type,
  editor,
  location,
}: {
  type:
    | "heading"
    | "paragraph"
    | "code"
    | "image"
    | "lineBreak"
    | "unorderedlist"
    | "list-item";
  editor: CustomEditor;
  location?: Location;
}) => {
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
  } else if (type === "unorderedlist") {
    const listBlock: CustomElement = {
      type: "unorderedlist",
      children: [
        {
          type: "list-item",
          children: [{ text: "" }],
        },
      ],
    };
    Transforms.insertNodes(editor, listBlock);
  } else if (type === "list-item") {
    const listItemBlock = { type: type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, listItemBlock);
  } else {
    const block = { type, children: [{ text: "" }] };
    if (location) {
      Transforms.insertNodes(editor, block, { at: [editor.children.length] });
    } else {
      Transforms.insertNodes(editor, block);
    }
  }

  ReactEditor.focus(editor);
};
