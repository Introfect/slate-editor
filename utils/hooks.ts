import { Editor, Element, Location, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CustomEditor, CustomElement } from "./types";
import { v4 as uuidv4 } from "uuid";

const insertParagraphBlock = (editor: CustomEditor) => {
  const paragraphBlock: CustomElement = {
    type: "paragraph",
    children: [{ text: "" }],
    id: uuidv4(),
  };
  Transforms.insertNodes(editor, paragraphBlock, {
    at: [editor.children.length],
  });
};

const insertImage = (src: string, editor: CustomEditor) => {
  const text = { text: "" };
  const image: CustomElement = {
    type: "image",
    src,
    children: [text],
    id: uuidv4(),
  };
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
    | "list-item"
    | "table"
    | "column"
    | "row";
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
          if (url) insertImage(url.toString(), editor);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  } else if (type === "lineBreak") {
    const lineBreakBlock: CustomElement = {
      type: "lineBreak",
      children: [{ text: "" }],
      id: uuidv4(),
    };
    Transforms.insertNodes(editor, lineBreakBlock, {
      at: [editor.children.length],
    });
    insertParagraphBlock(editor);
  } else if (type === "unorderedlist") {
    const listChildren: CustomElement = {
      type: "list-item",
      children: [{ text: "" }],
      id: uuidv4(),
    };
    const listBlock: CustomElement = {
      type: "unorderedlist",
      children: [listChildren],
      id: uuidv4(),
    };
    Transforms.insertNodes(editor, listBlock);
  } else if (type === "table") {
    const tableBlock: CustomElement = {
      type: "table",
      children: [
        {
          type: "table-row",
          children: [
            { type: "table-header", children: [{ text: "Header 1" }] },
            { type: "table-header", children: [{ text: "Header 2" }] },
          ],
        },
        {
          type: "table-row",
          children: [
            { type: "table-cell", children: [{ text: "" }] },
            { type: "table-cell", children: [{ text: "" }] },
          ],
        },
      ],
      id: uuidv4(),
    };
    Transforms.insertNodes(editor, tableBlock);
  } else if (type === "row") {
    const tableNode = Editor.above(editor, {
      match: (n) => Element.isElement(n) && n.type === "table",
    });
    if (tableNode) {
      const [table, tablePath] = tableNode;
      const columnsCount = table.children[0].children.length;
      const newRow: CustomElement = {
        type: "table-row",
        children: Array(columnsCount).fill({
          type: "table-cell",
          children: [{ text: "" }],
        }),
        id: uuidv4(),
      };
      Transforms.insertNodes(editor, newRow, {
        at: [...tablePath, table.children.length],
      });
    }
  } else if (type === "column") {
    const tableNode = Editor.above(editor, {
      match: (n) => Element.isElement(n) && n.type === "table",
    });
    if (tableNode) {
      const [table, tablePath] = tableNode;
      table.children.forEach((row, rowIndex: number) => {
        const newCell: CustomElement = {
          type: rowIndex === 0 ? "table-header" : "table-cell",
          children: [
            { text: rowIndex === 0 ? `Header ${row.children.length + 1}` : "" },
          ],
          id: uuidv4(),
        };
        Transforms.insertNodes(editor, newCell, {
          at: [...tablePath, rowIndex, row.children.length],
        });
      });
    }
  } else {
    const block = { type, children: [{ text: "" }], id: uuidv4() };
    Transforms.insertNodes(
      editor,
      block,
      location ? { at: location } : undefined
    );
  }

  ReactEditor.focus(editor);
};
